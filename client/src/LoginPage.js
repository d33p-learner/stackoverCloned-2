import { Component} from "react";
import Lower_header from "./Lower_header";
import styled from "styled-components";
import Input from "./Input";
import BlueButton from "./BlueButton";
import ErrorBox from "./ErrorBox";
import axios from "axios";
import UserContext from "./UserContext";
import { Redirect } from "react-router-dom";

const Container = styled.div`
  padding: 30px 20px;
`;

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      redirectToHomePage: false,
      error: false,
    };
  }

  login(ev) {
    ev.preventDefault();
    axios
      .post(
        "http://localhost:3030/login",
        {
          email: this.state.email,
          password: this.state.password,
        },
        { withCredentials: true }
      )
      .then(() => {
        this.context.checkAuth().then(() => {
          this.setState({ error: false, redirectToHomePage: true });
        });
      })
      .catch(() => this.setState({ error: true }));
  }
  render() {
    return (
      <>
        {this.state.redirectToHomePage && <Redirect to={"/"} />}
        <Container>
          <Lower_header style={{ marginBottom: "20px" }}>Login</Lower_header>
          {this.state.error && <ErrorBox>Login failed</ErrorBox>}

          <form onSubmit={(ev) => this.login(ev)}>
            <Input
              placeholder={"email"}
              type="email"
              value={this.state.email}
              onChange={(ev) => this.setState({ email: ev.target.value })}
            />
            <Input
              placeholder={"password"}
              type="password"
              value={this.state.password}
              onChange={(ev) => this.setState({ password: ev.target.value })}
            />
            <BlueButton type={"submit"}>Login</BlueButton>
          </form>
        </Container>
      </>
    );
  }
}

LoginPage.contextType = UserContext;

export default LoginPage;
