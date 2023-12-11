# Web Scraper Application

## Overview

This is a web scraper application built with Node.js and Express. It scrapes data from multiple e-commerce websites, including Snapdeal, Nykaa, Flipkart, Amazon, and JioMart.

## Features

- Scrapes product data from various e-commerce websites.
- Health check route to ensure the server is running.

## Getting Started

Follow the instructions below to set up and run the web scraper application on your local machine.

### Prerequisites

- Node.js installed on your machine.

### Installation

1.  Clone the repository:

    ```
    git clone https://github.com/your-username/your-repository.git
    ```

2.  Install dependencies:

    ```
    npm install
    ```

3.  Start the server:
    ```
    ./run_script.sh
    ```

### Routes

    ```
    Health route: /health - Returns "Server is healthy."
    ```

### E-commerce Scraping Routes

    ```
    Snapdeal: /scrape/snapdeal
    Nykaa: /scrape/nykaa
    Flipkart: /scrape/flipkart
    Amazon: /scrape/amazon
    JioMart: /scrape/jiomart
    ```
