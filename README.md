[![LinkedIn][linkedin-shield]][linkedin-url]

<br />
<div align="center">
  <a>
    <img src="assets/readme_banner.png" alt="Logo" width="100%">
  </a>

  <div style="margin-top:20px; margin-bottom:20px;">
  <img width="100" height="100" src="assets/mascot_head.png">
    <h1 align="center">BMO Wallet</h1>
  </div>

  <p align="center">
    A crypto wallet built with React Native
    <br />
    <a>Demo coming soon</a>
    ·
    <a href="https://github.com/vinnyhoward/rn-crypto-wallet/issues">Report Bug</a>
    ·
    <a href="https://github.com/vinnyhoward/rn-crypto-wallet/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>

## Introduction[![](assets/pin.svg)](#introduction)

BMO Wallet is a multi-chain cryptocurrency wallet built with React Native. This robust mobile application offers a comprehensive suite of features for managing digital assets across multiple blockchains, with a current focus on Ethereum and Solana networks.

### Key Features:
- **Multi-Chain Support**: Seamlessly manage Ethereum and Solana assets within a single, user-friendly interface.
- **Wallet Management**: Create new wallets, import existing ones, and manage multiple accounts with ease.
- **Transaction Handling**: Send, receive, and track transactions across supported blockchains.
- **Balance and Portfolio Tracking**: View real-time balances and monitor your overall crypto portfolio.
- **Security**: Implements encryption and secure storage techniques to protect your digital assets.
- **QR Code Integration**: Simplify address sharing and transaction processes with built-in QR code functionality.

Leveraging the power of Expo framework and Alchemy API, BMO Wallet provides a smooth, responsive user experience while ensuring reliable blockchain interactions. Whether you're a crypto enthusiast or a developer looking to explore mobile wallet implementation, BMO Wallet offers a feature-rich platform for managing digital currencies.

### Testnet-Only Application
**Important**: BMO Wallet is currently designed for use with the Ethereum Sepolia testnet and Solana Devnet only. It is not intended for use with real cryptocurrencies or on mainnet networks. This testnet focus allows for safe experimentation and development without risking actual digital assets.

#### Testnet Resources:
- **Ethereum (Sepolia Testnet)**: Obtain free test ETH from the [Sepolia Faucet](https://www.infura.io/faucet/sepolia).
- **Solana (Devnet)**: Acquire free test SOL from the [Solana Devnet Faucet](https://faucet.solana.com/).

### Development Focus
BMO Wallet serves as both a functional crypto wallet and a showcase of modern mobile development practices. It demonstrates the integration of blockchain technologies with React Native, emphasizing clean code architecture, robust state management with Redux, and a strong focus on security.

As I continue to evolve BMO Wallet, I'm committed to expanding its capabilities, enhancing security features, and potentially supporting additional blockchain networks in the future. This project represents my ongoing effort to create a robust, user-friendly cryptocurrency wallet that adapts to the ever-changing landscape of blockchain technology.

## Table of Contents[![](assets/pin.svg)](#table-of-contents)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Quick Start](#quick-start)
- [Roadmap](#roadmap)
- [License](#license)
- [Contact](#contact)

## Tech Stack[![](assets/pin.svg)](#tech-stack)

This project leverages a modern tech stack for building and managing a cross-platform cryptocurrency wallet application:

* [![typescript][typescript]][ts-url] - A strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.

* [![react-native][react-native]][rn-url] - A framework for building native apps using React, enabling native mobile development with JavaScript.

* [![expo][expo]][expo-url] - An open-source platform for making universal native apps with React that run on Android, iOS, and the web.

* [![redux][redux]][redux-url] - A predictable state container for JavaScript apps, used for managing state in the mobile app.

* [![styled-components][styled-components]][sc-url] - A library that utilizes tagged template literals to style your components at a component level using CSS.

* **Ethers.js** - A complete Ethereum wallet implementation and utilities in JavaScript (and TypeScript), used for blockchain interactions.

* **@solana/web3.js** - Solana’s JavaScript API library, enabling interaction with the Solana Blockchain.

* **Alchemy SDK** - A powerful toolkit that simplifies the process of making requests to the Blockchain, enhancing the app’s capability to interact with Ethereum and Solana.

<div align="right">[ <a href="#introduction">↑ Back to top ↑</a> ]</div>

---

## Features[![](assets/pin.svg)](#features)

### Wallet Management
- **Create Wallet**: Generate new wallets seamlessly.
- **Import Wallets**: Import existing wallets using mnemonic phrases.
- **Manage Multiple Wallets**: Create and manage multiple wallets using the same mnemonic phrase.
- **Account Management**: Rename and manage different wallet accounts.
- **Switch Wallets**: Easily switch between different wallet accounts.

| Creating a new wallet | Importing a wallet | Managing your wallet |
|:---:|:---:|:---:|
| <img width="200" src="assets/wallet_create.gif" alt="Creating a new wallet"> | <img width="200" src="assets/wallet_import.gif" alt="Importing a wallet"> | <img width="200" src="assets/wallet_management_alt.gif" alt="Managing your wallet"> |


### Wallet Balance and Transactions
- **Net Worth**: View the total net worth across all wallets.
- **Balance Viewing**: Check the balance of Ethereum and Solana wallets.
- **Transaction Management**:
  - Send and receive Ethereum and Solana transactions.
  - View a list of past transactions for both Ethereum and Solana.

| Viewing wallet transactions  | Viewing Ethereum balance  | Sending Ethereum |
|:---:|:---:|:---:|
| <img width="200" src="assets/networth.gif" alt="Creating a new wallet"> | <img width="200" src="assets/balance.gif" alt="Importing a wallet"> | <img width="200" src="assets/send-alt.gif" alt="Sending Crypto"> |

### Accessibility Features
- **QR Code Functionality**: Easily share wallet addresses and send cryptocurrencies via QR codes.

| Sharing Address  | Scanning QR code | 
|:---:|:---:|
| <img width="200" src="assets/sharing_qr.gif" alt="Creating a new wallet"> | <img width="200" src="assets/qr-send.gif" alt="Importing a wallet"> 

### Security

#### Encryption and Secure Storage
- **Advanced Encryption Standard (AES)**: Utilizes AES encryption, the gold standard in symmetric cryptography, to secure sensitive data.
- **Secure Local Storage**: Leverages React Native's `SecureStore` module, which uses Keychain Services on iOS and KeyStore on Android, providing OS-level security for stored data.

#### Cryptographic Best Practices
- **Password-Based Key Derivation Function 2 (PBKDF2)**:
  - Implements PBKDF2 for key derivation, significantly increasing resistance to brute-force attacks.
- **Salted Hashes**: Employs unique salts for each encryption operation, preventing rainbow table attacks and enhancing overall security.

#### Key Security
- **Unique Key Generation**: Implements a secure system for generating and storing unique encryption keys for each user, significantly enhancing the protection of sensitive data.
- **Advanced Key Derivation**: Utilizes key derivation functions to ensure that each user's encryption key is both strong and unique.

#### Wallet Security
- **Non-Custodial Design**: Users maintain full control of their private keys, which are never transmitted or stored unencrypted.
- **Mnemonic Phrase Protection**: Recovery phrases are encrypted before storage, ensuring they remain secure even if the device is compromised.

#### Code-Level Security Measures
- **Type Safety**: Utilizes TypeScript to prevent common programming errors and enhance code reliability.
- **Separation of Concerns**: Cryptographic operations are isolated in dedicated modules, facilitating code audits and reducing the risk of security vulnerabilities.
- **Error Handling**: Implements comprehensive error handling to prevent information leakage through error messages.

#### Future Security Enhancements (In Development)
- **Biometric Authentication**: Plans to integrate fingerprint and face recognition for an additional layer of security.
- **Secure Enclave Integration**: Future updates aim to leverage hardware-based key storage on supported devices for enhanced private key protection.
- **Transaction Signing**: Upcoming feature to allow offline transaction signing, further securing the transaction process.

#### Security Considerations for Users
- **Testnet Focus**: Currently designed for testnet use only. Users are advised against using real cryptocurrency with this wallet until a full security audit is completed.
- **Regular Updates**: The development team is committed to regular security updates and patch releases to address any discovered vulnerabilities promptly.

<div align="right">[ <a href="#introduction">↑ Back to top ↑</a> ]</div>

---

## Quick Start[![](assets/pin.svg)](#quick-start)

### Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14.x or later)
- Yarn (v1.22.x or later)
- Expo CLI (`npm install -g expo-cli`)

### Getting Started

To get the project up and running on your local machine, follow these steps:

1. Clone the repository:

```bash
git clone https://github.com/vinnyhoward/react-native-crypto-wallet.git
cd react-native-crypto-wallet
```

2. Install dependencies:

```bash
yarn install
```

3. Set up environment variables. Rename .env.example to .env and update the following keys with appropriate values:

```bash
EXPO_PUBLIC_ALCHEMY_ETH_KEY=YOUR_ALCHEMY_KEY
EXPO_PUBLIC_ALCHEMY_ETH_URL=https://eth-sepolia.g.alchemy.com/v2/
EXPO_PUBLIC_ALCHEMY_SOCKET_URL=wss://eth-sepolia.g.alchemy.com/v2/
EXPO_PUBLIC_ALCHEMY_SOL_URL=https://solana-devnet.g.alchemy.com/v2/
EXPO_PUBLIC_ALCHEMY_SOL_API_KEY=YOUR_ALCHEMY_KEY
EXPO_PUBLIC_ENVIRONMENT=development


```

4. Start the development server:

```bash
expo start
```

### Environment Variables

`EXPO_PUBLIC_ALCHEMY_ETH_KEY`: Your Alchemy API key for accessing Ethereum blockchain data.

`EXPO_PUBLIC_ALCHEMY_ETH_URL`: The base URL for Ethereum Alchemy API requests.

`EXPO_PUBLIC_ALCHEMY_SOCKET_URL`: The WebSocket URL for real-time updates from Alchemy.

`EXPO_PUBLIC_ALCHEMY_SOL_URL`: The base URL for Solana Alchemy API requests.

`EXPO_PUBLIC_ALCHEMY_SOL_API_KEY`: Your Alchemy API key for accessing Solana blockchain data.

`EXPO_PUBLIC_ENVIRONMENT`: Environment setting, e.g., development or production.


<div align="right">[ <a href="#introduction">↑ Back to top ↑</a> ]</div>

---

## Roadmap [![](assets/pin.svg)](#roadmap)

BMO Wallet is continuously evolving. Here's our exciting roadmap for future developments:

### Near Term Goals

#### Bug Fixes
- [x] Account list causes too many re-renders

#### Enhanced Security
- [x] Implement confirmation screen for transactions
- [ ] Integrate biometric authentication (fingerprint and face recognition)
- [x] Remove hardcoded environment variables and use dynamic key generation so each user has their own unique key.
- [x] Implement secure key generation and storage unique to each user
  - Utilizes advanced encryption methods for key derivation
  - Ensures each user has a unique, securely stored encryption key
- [ ] Add option for 2-factor authentication (2FA)

#### User Experience Improvements
- [ ] Animations and Transitions: 
  - [x] Enhance confirmation screen
  - [ ] Create engaging splash screen
  - [x] Improve create wallet screen animations
  - [ ] Add subtle animations for balance updates and transactions
- [x] Refactor and optimize Redux structure for better performance
- [ ] Implement light mode and customizable themes

#### Feature Enhancements
- [ ] Multi-chain pagination support for transaction history
- [ ] Add profit/loss tracking UI for purchased assets
- [ ] Implement real-time price alerts and notifications

### Long Term Goals

#### Blockchain Expansion
- [ ] Integrate Polygon blockchain support
- [ ] Add support for Bitcoin (BTC) transactions
- [ ] Explore integration with layer-2 solutions (e.g., Optimism, Arbitrum)

#### Advanced Features
- [ ] Implement NFT support:
  - [ ] List NFT transactions across all supported blockchains
  - [ ] Add NFT gallery view and management features

This roadmap is a living document and will evolve based on technological advancements, user feedback, and market trends.

Your feedback and suggestions are always welcome as I continue to improve and expand BMO Wallet!

<div align="right">[ <a href="#introduction">↑ Back to top ↑</a> ]</div>

---

## License [![](assets/pin.svg)](#license)

Distributed under the MIT License. See `LICENSE.txt` for more information.

<div align="right">[ <a href="#introduction">↑ Back to top ↑</a> ]</div>

---

## Contact [![](assets/pin.svg)](#contact)

Vincent Howard - [@NiftyDeveloper](https://twitter.com/NiftyDeveloper) - vincenguyenhoward@gmail.com

Project Link: [https://github.com/vinnyhoward/rn-crypto-wallet](https://github.com/vinnyhoward/rn-crypto-wallet)

<div align="right">[ <a href="#introduction">↑ Back to top ↑</a> ]</div>

---

[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/vinnyhoward/

[typescript]: https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white
[ts-url]: https://www.typescriptlang.org/

[react-native]: https://img.shields.io/badge/react_native-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB
[rn-url]: https://reactnative.dev/

[expo]: https://img.shields.io/badge/expo-1C1E24?style=for-the-badge&logo=expo&logoColor=#D04A37
[expo-url]: https://docs.expo.dev/

[styled-components]: https://img.shields.io/badge/styled--components-DB7093?style=for-the-badge&logo=styled-components&logoColor=white
[sc-url]: https://styled-components.com/

[redux]: https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white
[redux-url]: https://styled-components.com/