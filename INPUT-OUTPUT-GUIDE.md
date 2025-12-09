# Overview
This application is meant to be containerized, with the logs and console outputs not available to the end user.
To demonstrate that the application works normally, we provide Demo Inputs and Demo Outputs.

## 📋 Output Demo
To demonstrate that the application is working, we use MongoDB (cloud storage) to store live outputs of the application.

Please use MongoDB Atlas web version [MongoDB Atlas Data Explorer](https://cloud.mongodb.com/v2#/org/690c86ffde72ff370f48d58c) to monitor the outputs

## 📋 Inputs Demo
To demonstrate that the application is capable of taking external inputs, we use HTTP GET library to pull BTCUSDT prices from [Binance Web API](https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT)

These prices are saved to [MongoDB Atlas Data Explorer](https://cloud.mongodb.com/v2#/org/690c86ffde72ff370f48d58c) for monitoring of the connection to Binance.

***Please contact us for login information to Mongo DB Atlas Website***

# How to monitor the Outputs of the Application
You may use our MongoDB Cluster that we created for storing the outputs of this application.

**We Set Up A Dedicated Cluster for Zagrava Hello-World Demo Project:**
```
mongodb+srv://<Ask us for username>:<ask us for password>@hello-world.mtpwcmd.mongodb.net/?appName=Hello-World
```
If you use the MongoDB Cluster provided by us, ***please contact us for the login instructions to MongoDB Atlas***

# You can choose to create your own MongoDB Cluster:
This guide will help you create a free MongoDB Atlas account and get your database connection URL. 

**What is MongoDB Atlas?**
MongoDB Atlas is a free cloud database service where you can store data for your applications. Think of it like Google Drive, but for application data instead of documents.

**Time needed:** About 10-15 minutes

---

## Part 1: Creating Your MongoDB Atlas Account

### Step 1: Go to MongoDB Atlas Website
1. Open your web browser (Chrome, Firefox, Safari, etc.)
2. Go to: **https://www.mongodb.com/cloud/atlas**


### Step 2: Sign Up for an Account
1. You'll see a sign-up form
2. You can sign up using:
   - Your email address and create a password, OR
   - Your Google account (easier option)
3. Fill in your information and click **"Create your Atlas account"**


### Step 3: Complete the Welcome Questions
1. MongoDB will ask a few questions about how you plan to use it
2. You can select:
   - **Goal:** "Learn MongoDB" (or any option that fits)
   - **Type of data:** Choose any option (it doesn't really matter for learning)
   - Click **"Finish"** or **"Continue"**

---

## Part 2: Creating Your First Database Cluster

**What is a cluster?** Think of it as your actual database storage space in the cloud.

### Step 4: Start Creating a Cluster
1. You should now see a page that says **"Deploy a database"** or **"Create a cluster"**
2. Click the **"Create"** button under the **FREE tier** (labeled "M0" or "Shared")
3. Don't worry - the free tier is perfect for learning and small projects!


### Step 5: Choose Your Cloud Provider and Region
1. **Cloud Provider:** Keep the default (usually AWS) or choose any provider
2. **Region:** Choose a region closest to your location
   - For example: If you're in the US, choose a US region
   - If you're in Europe, choose a European region
3. The closer the region, the faster your database will be!

### Step 6: Name Your Cluster (Optional)
1. At the bottom, you can give your cluster a name
2. The default name (like "Cluster0") works fine
3. Click the big **"Create Cluster"** button
4. Wait 3-5 minutes while MongoDB creates your database
   - You'll see a loading screen saying "Creating your cluster..."
   - Don't close this page!

---

## Part 3: Setting Up Security (Very Important!)

### Step 7: Create a Database User
**What's this?** This is like creating a username and password to access your database.

1. After your cluster is created, you'll see a **"Security Quickstart"** pop-up
2. If not, look for **"Database Access"** in the left menu, then click **"Add New Database User"**

**Creating the user:**
1. **Authentication Method:** Keep it on "Password"
2. **Username:** Type a username (example: `myappuser`)
   - ⚠️ Write this down! You'll need it later
3. **Password:** Type a strong password OR click "Autogenerate Secure Password"
   - ⚠️ Copy and save this password somewhere safe! You'll need it later
4. **Database User Privileges:** Keep it as "Read and write to any database"
5. Click **"Add User"**

**Important:** Save your username and password in a safe place (like a note on your computer). You won't be able to see the password again!

### Step 8: Whitelist IP Addresses
**What's this?** This controls which computers can connect to your database. It's like a security guard checking IDs.

1. You'll now see an **"IP Access List"** section
2. Click **"Add IP Address"** or **"Add Entry"**
3. You have two options:

   **Option A - For Development/Learning (Easier):**
   - Click **"Allow Access from Anywhere"**
   - It will add `0.0.0.0/0`
   - This lets any computer connect (less secure, but fine for learning)
   
   **Option B - For Production (More Secure):**
   - Click **"Add Current IP Address"**
   - It will add your computer's IP address
   - This only lets your computer connect (more secure)

4. Click **"Confirm"** or **"Add Entry"**

---

## Part 4: Getting Your MongoDB Connection URL

### Step 9: Navigate to Your Cluster
1. Click **"Database"** in the left sidebar menu
2. You should see your cluster (named "Cluster0" or whatever you named it)
3. The status should show a green checkmark or say "Active"


### Step 10: Get Your Connection String
1. Find your cluster and click the **"Connect"** button
2. You'll see several connection options
3. Click on **"Connect your application"**


### Step 11: Copy Your Connection URL
1. Make sure **"Driver"** is selected at the top
2. **Driver:** Select your programming language (e.g., Node.js)
3. **Version:** Keep the default version
4. You'll see a connection string that looks like this:

```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/
```

5. Click the **"Copy"** button next to the connection string

---

## Part 5: Adding URL to Your Project

### Step 12: Add to Your Environment File

1. Open your `demo.env` file in your project
2. Add the MongoDB connection URL with the variable name `MONGODB_URI`
3. Replace `<username>` and `<password>` with your actual credentials

**We Set Up A Dedicated Cluster for Zagrava Hello-World Demo Project:**
```
mongodb+srv://<Ask us for username>:<ask us for password>@hello-world.mtpwcmd.mongodb.net/?appName=Hello-World
```
