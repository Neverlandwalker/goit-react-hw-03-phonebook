import { Component } from 'react'; 
import { ContactForm } from 'components/ContactForm/ContactForm';
import { nanoid } from 'nanoid'
import { Container } from 'components/App.styled';
import { FilterField } from 'components/FilterField/FilterField';
import { ContactList } from 'components/ContactList/ContactList';
import { Notify } from 'notiflix/build/notiflix-notify-aio';




export class App extends Component {
  state = {
    contacts: [],
    filter: '',
  };
  componentDidUpdate(prevProps, prevState) {

    if (this.state.contacts !== prevState.contacts) {
      localStorage.setItem('contacts', JSON.stringify(this.state.contacts));
    }
   }

  
  componentDidMount() {
    const contacts = localStorage.getItem('contacts');
    const parseContacts = JSON.parse(contacts);

    if (parseContacts) {
      this.setState({ contacts: parseContacts }); 
    }
  }
  handleSubmit = (values, { resetForm }) => {
    resetForm();
    console.log(this.state)
    const { name, number } = values;

    const contact = {
      name,
      number,
    };
   
    const dublicateContact = this.findDublicateContact(
      contact,
      this.state.contacts
    );

    dublicateContact
      ? Notify.failure(`${contact.name} is already in contacts`)
      : this.setState(prevState => ({
        contacts: [...prevState.contacts, { ...values, id: nanoid() }],
      }));
        Notify.success(` Added new contact ${contact.name}`)
  };

  findDublicateContact = (contact, contactsList) => {
    return contactsList.find(
      item => item.name.toLowerCase() === contact.name.toLowerCase()
    );
  };
  
  
  
  onFilterChange = e => {
    this.setState({
      filter: e.currentTarget.value,
    });
  };
  
  getRequiredCard = () => {
    const normalizedFilter = this.state.filter.toLowerCase();
    return this.state.contacts.filter(contact =>
      contact.name.toLowerCase().includes(normalizedFilter)
    );
  };
  
  deleteCard = contactId => {
    this.setState(prevState => ({
      contacts: prevState.contacts.filter(contact => contact.id !== contactId),
    }));
    Notify.success(`Deleated`);
  };

  render() {
    const requiredCard = this.getRequiredCard();
    return (
      <Container>
        <h1>Phonebook</h1>
        <ContactForm onSubmit={this.handleSubmit} />
        <h2>Contacts</h2>
        <FilterField
          value={this.state.filter}
          onFilterChange={this.onFilterChange}
        />
        <ContactList requiredCard={requiredCard}  deleteCard={this.deleteCard} />
      </Container>
    );
  }
  
};
// check
