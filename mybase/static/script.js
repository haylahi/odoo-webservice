const {render} = ReactDOM;
const {Link, BrowserRouter, Route} = ReactRouterDOM;

var react_components_container = $('#example');


class hom extends React.Component {

    render(){
      return (
        <div>
          Homeo
        </div>
      );
    }      
  }

class about1 extends React.Component {

    render(){
      return (
        <div>
          Abouto
        </div>
      );
    }      
  }


  var routing_links_pages = (    
    <BrowserRouter>
      <div>
        <header>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About with fun</Link>
            </li>
          </ul>
        </header>        
        <div>
          <Route exact path="/" component={hom} />
          <Route path="/about" component={about1} />
        </div>        
        <footer>Foot</footer>
      </div>
    </BrowserRouter>    
  );
  
  render(routing_links_pages,react_components_container[0]);
  