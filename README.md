# Kitties App

Kitties is a react-native cat profile management application to manage cat profiles. You can edit existing profiles or add new ones by retrieving pictures with the phone camera or by taking pictures in the gallery. The possibility to choose random cat pictures is also available. The persitence of the application is ensured by redux and sqlight..<br />

![](./Images/screenshoot/01.png)
![](./Images/screenshoot/02.png)
![](./Images/screenshoot/03.png)
![](./Images/screenshoot/04.png)
![](./Images/screenshoot/05.png)
![](./Images/screenshoot/07.png)
![](./Images/screenshoot/08.png)
![](./Images/screenshoot/06.png)
![](./Images/screenshoot/09.png)
![](./Images/screenshoot/10.png)


## Installation


```bash
git clone https://github.com/Cyf0x/kitties.git
cd kitties
npm install
npm start
```


## Try it on expo
<a href="https://expo.io/@kali00/kitties">https://expo.io/@kali00/kitties</a>

## Installation


```bash
git clone https://github.com/Cyf0x/kitties.git
cd kitties
npm install
npm start
```

## Application development structure

<h3>1. Navigation</h3>

The application is built with expo. It divides it into several main categories accessible by the user through a drawernavigator.
A stacknavigator allows to navigate between the different routes at the time of certain user choice.
The drawernavigator is encapsulated in a switchnavigator allowing the installation in the future of a connection interface.

<h3>1. Component</h3>

**Portfolio**
The portfolio is the management of the user's cat portfolio. Once cats are added it is possible to modify each cat card. The modification allows you to review all the values and choose a picture from the phone's gallery or with the phone's camera or choose a random cat picture. In this portfolio section it is also possible to delete a cat.
An overview modal is also available by clicking on a cat card.

**Create a cat**
The cat creation part allows you to create a new cat by fetching an image from the camera or from the phone gallery or by choosing an image of random cat. Once the cat is validated it is automatically added to the portfolio section. updated by redux

**Adopt a cat**
this section works with the cryptokitties.com api.
It allows you to retrieve a cat and its information and to import it by adopting it in the portfolio section.

## Persistence structure and redux

Persitence is performed using an sqlight database and the use of redux to create a global state and update the different components of the application while respecting the routing rules of react native.
To make it short with each modification or addition of a new cat. The local database is updated. It is retrieved and used to update the global redux state thanks to different actions.
When starting the application, the database is read and the global state is defined by a redux action.
I could have used the persistence of redux. But having never used redux before this week I chose this hybrid solution in order to guarantee a functional return of the application within the given time delay. 
