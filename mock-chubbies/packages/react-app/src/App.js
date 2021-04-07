import React from "react";
import { Contract } from "@ethersproject/contracts";
import { getDefaultProvider } from "@ethersproject/providers";
import { RenderPromises, useQuery } from "@apollo/react-hooks";

import { Body, Button, Header, Image, Link } from "./components";
import logo from "./ethereumLogo.png";
import useWeb3Modal from "./hooks/useWeb3Modal";

import { addresses, abis } from "@project/contracts";
import GET_TRANSFERS from "./graphql/subgraph";

function WalletButton({ provider, loadWeb3Modal, logoutOfWeb3Modal }) {
  return (
    <Button
      onClick={() => {
        if (!provider) {
          loadWeb3Modal();
        } else {
          logoutOfWeb3Modal();
        }
      }}
    >
      {!provider ? "Connect Wallet" : "Disconnect Wallet"}
    </Button>
  );
}

class Status extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      balance: ""
    };
  }

  async handleClick() {
    const defaultProvider = this.props.provider;
    // Create an instance of an ethers.js Contract
    // Read more about ethers.js on https://docs.ethers.io/v5/api/contract/contract/
    const mock_chubbies_contract = new Contract(addresses.mock_chubbies, abis.mock_chubbies, defaultProvider);
    const signer = defaultProvider.getSigner();
    await mock_chubbies_contract.connect(signer).adoptChubby(2, {value: "0x008E1BC9BF040000"});

    this.setState({
      balance: "You just got two chubbies."
    });
  }

  render() {
    return (<div>
      <Button
        onClick={async () => { await this.handleClick() }}
      >
        Buy Chubbies
      </Button>
      <div>{this.state.balance}</div>
    </div>);
  }
}

function App() {
  const { loading, error, data } = useQuery(GET_TRANSFERS);
  const [provider, loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal();

  React.useEffect(() => {
    if (!loading && !error && data && data.transfers) {
      console.log({ transfers: data.transfers });
    }
  }, [loading, error, data]);

  return (
    <div>
      <Header>
        <WalletButton provider={provider} loadWeb3Modal={loadWeb3Modal} logoutOfWeb3Modal={logoutOfWeb3Modal} />
      </Header>
      <Body>
        <p>
          Welcome to Mock Chubbies
        </p>
        <Status provider={provider}/>
      </Body>
    </div>
  );
}

export default App;
