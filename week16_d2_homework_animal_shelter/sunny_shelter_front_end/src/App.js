import React, {Component} from 'react';
import './App.css';
// import NewAnimalForm from "./Components/NewAnimalForm.js";

let baseURL = process.env.REACT_APP_BASEURL;

if (process.env.NODE_ENV === "development") {
  baseURL = "http://localhost:3003";
}

console.log("current base URL:", baseURL);

fetch(baseURL + "/animals")
  .then(
    data => {
      return data.json();
    },
    err => console.log(err)
  )
  .then(
    parsedData => console.log(parsedData),
    err => console.log(err)
);


class NewAnimalForm extends React.Component {

  state = {
    name: '',
    species: '',
    breed: '',
    image: '',
    age: 0,
    adopted: false,
    personalityTraits: []
  }

  handleChange = event => {
    this.setState({ [event.target.id]: event.target.value });
  };

  handleSubmit = event => {
    event.preventDefault();
    fetch(this.props.baseURL + "/animals", {
      method: "POST",
      body: JSON.stringify({ 
          name: this.state.name,
          species: this.state.species,
          breed: this.state.breed,
          image: this.state.image,
          age: this.state.age
         }),
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(res => res.json())
    .then(resJson => {
      this.props.handleAddAnimal(resJson);
      this.setState({
        name: '',
        species: '',
        breed: '',
        image: '',
        age: ''
      });
    })
    .then(event => {
      this.props.cancelNewForm(event)
    })
    .catch(error => console.error({ Error: error }));
  }

  render() {
    return(
      <div className="form-container">
        <h3>Add A New Animal</h3>
        <form onSubmit={this.handleSubmit}>
        <div class="form-row">
          <div class="form-group col-md-6">
            <label htmlFor="name">Name</label>
            <input type="text" class="form-control" id="name" name="name" onChange={this.handleChange} placeholder="Name" />
          </div>
          <div class="form-group col-md-6">
            <label htmlFor="image">Image URL</label>
            <input type="text" class="form-control" id="image" name="image" onChange={this.handleChange} placeholder="Image URL" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group col-md-4">
            <label htmlFor="species">Species</label>
            <input type="text" class="form-control" id="species" name="species" onChange={this.handleChange} placeholder="Species" />
          </div>
          <div class="form-group col-md-4">
            <label htmlFor="breed">Breed</label>
            <input type="text" class="form-control" id="breed" name="breed" onChange={this.handleChange} placeholder="Breed" />
          </div>
          <div class="form-group col-md-4">
            <label htmlFor="age">Age</label>
            <input type="text" class="form-control" id="age" name="age" onChange={this.handleChange} placeholder="Age" />
          </div>
        </div>
          <button type="submit" class="btn btn-primary" id="add-bookmark-button">Submit</button>
        </form>
        <button type="button" onClick={(event) => this.props.cancelNewForm(event)} class="btn btn-outline-light" id="cancel-new-button">Cancel</button>
      </div>
    );
  }
}


class EditAnimalForm extends React.Component {

  state = {
    name: this.props.animal.name,
    species: this.props.animal.species,
    breed: this.props.animal.breed,
    image: this.props.animal.image,
    age: this.props.animal.age,
    adopted: false,
    personalityTraits: []
  }

  handleChange = event => {
    this.setState({ [event.target.id]: event.target.value });
  };

  handleSubmit = event => {
    event.preventDefault();
    fetch(this.props.baseURL + "/animals/" + this.props.animal._id, {
      method: "PUT",
      body: JSON.stringify({ 
          name: this.state.name,
          species: this.state.species,
          breed: this.state.breed,
          image: this.state.image,
          age: this.state.age
         }),
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(res => res.json())
    .then(resJson => {
      this.props.editAnimal(resJson);
    })
    .then(event => {
      this.props.closeEditForm(event)
    })
    .catch(error => console.error({ Error: error }));
  }

  render() {
    return(
      <div className="form-container">
        <h3>Edit {this.props.animal.name}'s Profile</h3>
        <form onSubmit={this.handleSubmit}>
          <div class="form-row">
            <div class="form-group col-md-6">
              <label htmlFor="name">Name</label>
              <input type="text" class="form-control" id="name" name="name" onChange={this.handleChange} placeholder={this.props.animal.name} />
            </div>
            <div class="form-group col-md-6">
              <label htmlFor="image">Image URL</label>
              <input type="text" class="form-control" id="image" name="image" onChange={this.handleChange} placeholder={this.props.animal.image} />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group col-md-4">
              <label htmlFor="species">Species</label>
              <input type="text" class="form-control" id="species" name="species" onChange={this.handleChange} placeholder={this.props.animal.species} />
            </div>
            <div class="form-group col-md-4">
              <label htmlFor="breed">Breed</label>
              <input type="text" class="form-control" id="breed" name="breed" onChange={this.handleChange} placeholder={this.props.animal.breed} />
            </div>
            <div class="form-group col-md-4">
              <label htmlFor="age">Age</label>
              <input type="text" class="form-control" id="age" name="age" onChange={this.handleChange} placeholder={this.props.animal.age} />
            </div>
          </div>
          <button type="submit" class="btn btn-success" id="edit-form-button">Complete</button>
        </form>
        <button type="button" onClick={(event) => this.props.closeEditForm(event)} class="btn btn-outline-light" id="edit-form-button">Cancel</button>
      </div>
    );
  }
}


class App extends Component {
  state = {
    animals: [],
    addAnimal: false
  }

  getAnimals = () => {
    fetch(baseURL + "/animals")
      .then(
        data => {
          return data.json();
        },
        err => console.log(err)
      )
      .then(
        parsedData => this.setState({ animals: parsedData }),
        err => console.log(err)
      );
  };

  handleAddAnimal = animal => {
    const copyAnimals = [...this.state.animals];
    copyAnimals.unshift(animal);
    this.setState({
      animals: copyAnimals,
      name: '',
      species: '',
      breed: '',
      image: '',
      age: '',
      animal: {},
      editAnimalForm: false
    });
  };

  deleteAnimal = id => {
    fetch(baseURL + "/animals/" + id, {
      method: 'DELETE'
    }).then( res => {
      const animalArr = this.state.animals.filter( animal => {
        return animal._id !== id
      })
      this.setState({animals: animalArr})
    })
  }

  getAnimal = animal => {
    this.setState({
      animal,
      editAnimalForm: true,
      addAnimal: false
    })
  }

  editAnimal = (resJson) => {
    const copyAnimals = [...this.state.animals]
    const findIndex = this.state.animals.findIndex(animal => animal._id === animal._id)
    copyAnimals[findIndex].name = resJson.name
    copyAnimals[findIndex].species = resJson.species
    copyAnimals[findIndex].breed = resJson.breed
    copyAnimals[findIndex].image = resJson.image
    copyAnimals[findIndex].age = resJson.age
    this.setState({animals: copyAnimals})
  }

  handleEditAnimalSubmit = () => {
    this.setState({
      editAnimalForm: false,
    });
  }

  openNewAnimalForm = () => {
    this.setState({
      editAnimalForm:false,
      animal: false,
      addAnimal: true
    });
  }

  closeNewAnimalForm = () => {
    this.setState({
      addAnimal: false
    });
  }



  render() {
    return (
      <div>
        <div className="navBar">
          <h1>Animal Shelter</h1>
          <button type="button" onClick={this.openNewAnimalForm} class="btn btn-light" id="navBar-button">Add Animal</button>
        </div>
        <h2 id="title">Animal Homelessness System - Los Angeles</h2>
        <div className="form-app-container">
          { this.state.addAnimal ? <NewAnimalForm baseURL={baseURL} handleAddAnimal={this.handleAddAnimal} cancelNewForm={this.closeNewAnimalForm} /> : null }
          { this.state.editAnimalForm && this.state.animal ? <EditAnimalForm baseURL={baseURL} animal={this.state.animal} closeEditForm={this.handleEditAnimalSubmit} editAnimal={this.editAnimal} /> : null }
        </div>
        <div className="animals-container">
          <table class="table table-hover table-dark">
            <thead>
              <tr>
                <th scope="col"><h5>Name</h5></th>
                <th scope="col"><h5>Species</h5></th>
                <th scope="col"><h5>Breed</h5></th>
                <th scope="col"><h5>Image</h5></th>
                <th scope="col"><h5>Age</h5></th>
                <th scope="col"><h5>Status</h5></th>
                <th scope="col"><h5>Options</h5></th>
              </tr>
            </thead>
            <tbody>
              {this.state.animals.map(animal => (
                <tr key={animal._id}>
                  <td><p>{animal.name}</p></td>
                  <td><p>{animal.species}</p></td>
                  <td><p>{animal.breed}</p></td>
                  <td className="button-td-img"><img src={animal.image} alt="Animal Image"></img></td>
                  <td className="age-icon"><p>{animal.age}</p></td>
                  <td className="button-td"><button type="button" onClick={() => this.deleteAnimal(animal._id)} class="btn btn-success" id="adopted-list-button">Adopted</button></td>
                  <td className="button-td"><button type="button" onClick={() => this.getAnimal(animal)} class="btn btn-info" id="animal-list-button">Edit</button></td>
                </tr>
                )
                )}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
  componentDidMount() {
    this.getAnimals();
  }
}

export default App;
