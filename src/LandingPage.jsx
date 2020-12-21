import {Component, Fragment} from 'react';
import {Container, Jumbotron, Image} from 'react-bootstrap';
import SearchBar from './SearchBar';

import TV_MAZE_LOGO from "./images/tvmaze.png"

export default class LandingPage extends Component 
{
    constructor()
    {
        super();
    }

    render()
    {
        return (
            <div >
                <Container className="mt-4">
                    <Image width={850} style={{cursor: 'pointer'}} onClick={() => window.location.href = '/'} src={TV_MAZE_LOGO} fluid/>
                    <div className="mt-5">
                        <SearchBar />
                    </div>
                </Container>
            </div>
        )
    }

}



