# Vis.js Network - Build Report

## Live preview
[Link](https://master.d32g0jsy3mix92.amplifyapp.com/)

## Overview:

1. Created a network map using the Vis.js with the design provided. 
2. Configured the map config to enable interactions as requested. 
3. Configured the map events to respond to the node interactions. 
4. Loaded JSON data and manipulated the dataset to initialize the map. 
5. Created a map handler with the following:
    * Inputs:
        * id: The id prop of the HTML element to draw the map in.
        * dataSet: The JSON object that contains the data to draw the nodes. 
        * readyCallBack: The method that is called once the map is ready.
        * callbackFunction: The method that is called when the cursor interacts with the nodes. 
    * Methods:
        * updateDataset: Accepts a new dataset and redraws the map with the provided dataset. 
        * reDraw: Redraws the map with the current dataset. 

## Issues
1. Vis.js does not have support for defining canvas size or containing the object in the canvas viewport. [Reference link.](https://github.com/almende/vis/issues/1371)
2. Vis.js does not support the animations on the node hover event. 
3. Increased font-size results in increased circle size which makes the conjoining lines look smaller. As the data is being loaded from JSON, the line length can not be controlled manually.