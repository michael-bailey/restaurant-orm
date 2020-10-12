# Sequelize Models

When working with Sequelize, there is one class that all objects should inherit from, the Model class.

This provides some methods for defining a model to be used before any work is done with the database.



## Methods of note

Many of the methods to do with sequelize are static and apply to the class of objects rather than individual instances here are some examples



```javascript
Model.init()
```

This is used to define a model. This overrides the language methid of defining a class. This method is given a object with keys as the class feilds and to pair with this a datatypes object from the sequlize library.

