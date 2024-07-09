[![LinkedIn][linkedin-shield]][linkedin-url]

<br />
<div align="center">
  <a>
    <img src="assets/readme_banner_main.png" alt="Logo" width="100%">
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

This project is a React Native application for managing cryptocurrency transactions and balances. It utilizes the Expo framework, the Alchemy API for blockchain interaction, and is built with a focus on Ethereum and Solana cryptocurrencies.

### Testnet-Only Application
This application is designed solely for interaction with the Ethereum Sepolia testnet and the Solana Devnet. **Do not use real wallets or any wallets containing actual cryptocurrencies with this app.** Ensure you use wallet addresses generated within this app or other testnet-specific wallets that hold no real-world value.

#### Testnet Resources
- **Ethereum (Sepolia Testnet)**: Obtain free Sepolia testnet ETH from the [Sepolia Faucet](https://www.infura.io/faucet/sepolia).
- **Solana (Devnet)**: Acquire free SOL tokens from the [Solana Devnet Faucet](https://faucet.solana.com/).

### Network Configuration Assurance
Ensure the `.env` variables are set to connect only to these testnet environments to prevent any real cryptocurrency transactions. Always use testnet addresses when interacting with this application.

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
| <img width="200" src="assets/wallet_create.gif" alt="Creating a new wallet"> | <img width="200" src="assets/wallet_import.gif" alt="Importing a wallet"> | <img width="200" src="assets/wallet_management.gif" alt="Managing your wallet"> |


### Wallet Balance and Transactions
- **Net Worth**: View the total net worth across all wallets.
- **Balance Viewing**: Check the balance of Ethereum and Solana wallets.
- **Transaction Management**:
  - Send and receive Ethereum and Solana transactions.
  - View a list of past transactions for both Ethereum and Solana.

| Viewing wallet transactions  | Viewing Ethereum balance  | Sending Ethereum |
|:---:|:---:|:---:|
| <img width="200" src="assets/networth.gif" alt="Creating a new wallet"> | <img width="200" src="assets/balance.gif" alt="Importing a wallet"> | <img width="200" src="assets/send-alt.gif" alt="Managing your wallet"> |

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
  - Utilizes a high iteration count (configurable up to 100,000) to enhance security, balanced with performance considerations.
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

BMO Wallet's security architecture is designed to meet and exceed industry standards, providing a robust foundation for managing digital assets securely. While we strive for the highest security standards, users should always follow best practices in cryptocurrency management, including safeguarding recovery phrases and regularly updating the application.


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

`EXPO_PUBLIC_PASSWORD`: Needed for encryption

`EXPO_PUBLIC_SALT`: Needed for encryption

<div align="right">[ <a href="#introduction">↑ Back to top ↑</a> ]</div>

---

## Roadmap [![](assets/pin.svg)](#roadmap)

BMO Wallet is continuously evolving. Here's our exciting roadmap for future developments:

### Near Term Goals

#### Bug Fixes
- [ ] Account list causes too many re-renders

#### Enhanced Security
- [x] Implement confirmation screen for transactions
- [ ] Integrate biometric authentication (fingerprint and face recognition)
- [x] Remove hardcoded environment variables `EXPO_PUBLIC_PASSWORD` and `EXPO_PUBLIC_SALT`
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