import {Component} from 'react';
import {Form, Button, Col, InputGroup, Alert, Container, Row, Image, Figure} from 'react-bootstrap';
import axios from 'axios';

const dropdownSearchOptions = ['All', 'Show', 'People',];
const SHOW_SEARCH = "http://api.tvmaze.com/search/shows?q=";
const PEOPLE_SEARCH = "http://api.tvmaze.com/search/people?q=";
const PLACEHOLDER_IMAGE = "https://via.placeholder.com/210X295?text=No+Image+Specified";
const NO_DESCRIPTION = 'No description provided.';
const NO_NAME = 'No name provided.';
const WIKIPEDIA = "https://en.wikipedia.org/wiki/";



export default class LandingPage extends Component 
{
    constructor()
    {
        super();
        this.state = {
            search: '',
            dropdownOption: dropdownSearchOptions[0],
            showResults: [],
            peopleResults: [],
            showAlert: false,
            alertMessage: '',
            displayModal: false,
            episodeList: [],
        }
    }

    handlePersonClick = (person) => {
        let url = WIKIPEDIA + person.replace(/ /, '_');
        window.open(url);
    }

    handleModal = (showID) => 
    {
        this.getEpisodes(showID);
        this.setState({displayModal: true})
    }
    
    closeModal = () => 
    {
        this.setState({displayModal: false});
    }

    searchForShow = async () => 
    {
        let url = ''
        let tempResults = []

        url = SHOW_SEARCH + this.state.search;
        await axios.get(url)
            .then(result => {
                result.data.forEach(element => {
                    console.log(element);
                    tempResults.push(element);
                });
                this.setState({showResults : tempResults})
            })
            .catch(error => {
                const errorMessage = error.msg;
                console.log(error);
                this.setState({showAlert: true, alertMessage: (this.state.alertMessage + errorMessage)});
            })
    }

    searchForPeople = async () => 
    {
        let url = ''
        let tempResults = []

        url = PEOPLE_SEARCH + this.state.search;
        await axios.get(url)
            .then(result => {
                result.data.forEach(element => {
                    console.log(element);
                    tempResults.push(element);
                });
                this.setState({peopleResults : tempResults})
            })
            .catch(error => {
                const errorMessage = error.msg;
                console.log(error);
                this.setState({showAlert: true, alertMessage: (this.state.alertMessage + errorMessage)});
            })
    }


    handleSearch = (event) =>
    {
        // reset arrays
        this.setState({peopleResults: [], showResults: []});

        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();

        let option = this.state.dropdownOption;
        
        console.log('HERE IS THE OPTION:' + option)

        if (option === dropdownSearchOptions[1]) // show
        {
            this.searchForShow();
        }
        else if (option === dropdownSearchOptions[2]) // people
        {
            this.searchForPeople();
        }
        else // all
        {
            this.searchForShow();
            this.searchForPeople();
        }
    }


    render()
    {
        return (
            <div>
                <Alert 
                    className="mt-2"
                    show={this.state.showAlert}
                    variant="danger"
                    message={this.state.alertMessage} />
                <div>
                    <Form>
                        <InputGroup>

                        <InputGroup.Prepend>
                            <Form.Control as="select"
                            style={{color: 'gray'}}
                            value={this.state.dropdownOption}
                            onChange={(e) => this.setState({dropdownOption: e.target.value})}>
                                    {dropdownSearchOptions.map((option) => (
                                    <option key={option} value={option}>{option}</option>))}
                                </Form.Control>
                        </InputGroup.Prepend>
                            <Form.Control
                                required
                                placeholder="Search for a show, person, etc."
                                value={this.state.search}
                                onChange={(e) => this.setState({search: e.target.value})}
                            />
                            <InputGroup.Append>
                                <Button variant="secondary" onClick={this.handleSearch}>Search</Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </Form>
                </div>
                
                {(this.state.showResults.length > 0)? 
                <div>
                    <h3 className="mt-4 mb-4">Shows</h3>
                    {this.state.showResults.map((result) => (
                        <div>
                            <Container>
                                <Row>
                                    <Col>
                                        {result.show.image ? <Image src={result.show.image.medium} /> : <Image src={PLACEHOLDER_IMAGE} />}
                                    </Col>
                                    <Col>
                                        <h5>{result.show.name ? result.show.name : NO_NAME}</h5>
                                        <br/>
                                        {result.show.summary ? result.show.summary.replace(/<p>|<b>|<\/p>|<\/b>|<i>|<\/i>/g, '') : NO_DESCRIPTION}
                                        <br /><br />
                                        <Button variant="info">Episodes</Button>
                                    </Col>
                                </Row>
                            </Container>
                            <hr/>
                        </div>
                    ))}
                </div> : null}

                {(this.state.peopleResults.length > 0) ? 
                <div>
                    <h3 className="mt-4 mb-4">People</h3>
                <Row>
                    {this.state.peopleResults.map((result) => (
                    <div>
                        <Col>
                            <Figure style={{cursor: 'pointer'}} onClick={() => this.handlePersonClick(result.person.name)}>
                                {result.person.image ? <Figure.Image src={result.person.image.medium}/> : <Image src={PLACEHOLDER_IMAGE} />}
                                <Figure.Caption>{result.person.name ? result.person.name : NO_NAME}</Figure.Caption>
                            </Figure>
                        </Col>
                    </div>
                    ))}
                </Row>
                </div> 
                : null}
            </div>
        )
    }

}