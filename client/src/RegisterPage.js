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

class RegisterPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      redirectToTheHomePage: false,
      error: false,
    };
  }

  register(ev) {
    ev.preventDefault();
    axios
      .post(
        "http://localhost:3030/register",
        {
          email: this.state.email,
          password: this.state.password,
        },
        { withCredentials: true }
      )
      .then(() => {
        this.context
          .checkAuth()
          .then(() =>
            this.setState({ error: false, redirectToTheHomePage: true })
          );
      })
      .catch((error) => {
        this.setState({ error: error.response.data });
      });
  }
  render() {
    return (
      <>
        {this.state.redirectToTheHomePage && <Redirect to={"/"} />}
        <Container>
          <Lower_header style={{ marginBottom: "20px" }}>Register</Lower_header>
          {this.state.error && <ErrorBox>{this.state.error}</ErrorBox>}

          <form onSubmit={(ev) => this.register(ev)}>
            <Input
              placeholder={"email"}
              type="email"
              value={this.state.email}
              onChange={(ev) => this.setState({ email: ev.target.value })}
            />
            <Input
              placeholder={"password"}
              autocomplete={"new-password"}
              type="password"
              value={this.state.password}
              onChange={(ev) => this.setState({ password: ev.target.value })}
            />
            <BlueButton type={"submit"}>Register</BlueButton>
          </form>
        </Container>
      </>
    );
  }
}

RegisterPage.contextType = UserContext;

export default RegisterPage;
