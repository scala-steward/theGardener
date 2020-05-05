```thegardener
{
  "page" :
     {
        "label": "Getting started",
        "description": "Getting started to write documentation"
     }
}
```

![Roles](../assets/images/theGardener_role_writer.png)

**Write your documentation in your project source code in Markdown.** As MarkDown preview is embedded in any modern IDE, you will have an immediate preview , moreover if you push your current branch you will have easily a view of the output in theGardener application before even merging your code.


# Requirement


Your project need to be configured on theGardener instance : 

 - your project origin Git repository is well defined
 - your project is attached to a node of the hierarchy in order to be displayed at some point in the left menu
 - on the project level ,
 
   -  _documentationRootPath_ is defined 
 
Once this configuration done, you can apply the following format.

# Directories and pages format 

The hierarchy of directories and pages is defined by one unique _thegardener.json_ file at each directory. 
The first _thegardener.json_ file expected by theGardener application is located in the directory referred by _documentationRootPath_ . 

For instance, for the project _myProject_

-  _documentationRootPath_ = /documentation

   - the file _myProject/documentation/thegardener.json_ should exists.

This file should have the following format :

```
{
  "directory" :
  {
    "label": "theGardener",
    "description": "In our documentation we trust.",
    "pages": [
      "why",
      "prerequisite",
      "changelog"
    ],
    "children" :[
      "guides"
    ]
  }
}
```

- directory

   - label: define the text shown on the menu item
   - description: define the tooltip of the menu item
   - pages: define the list of pages in order attached to this directory. 
   
      - Each directory has a list of pages that are displayed as tabs. The tabs respect the order of pages defined here.
      - In the example, _why_ refer to a file _why.md_ in the current directory.
      
   - children: define the list of sub directories in order attached to this directory.  
      
      - Each directory has a list of directories that are displayed as sub items in the menu. The sub items respect the order of children defined here.
      - In the example, _guides_ refer to a directory _guides_ in the current directory
      
         - a file _guides/thegardener.json_ should exists to define how to display the sub directory. This is a recursive structure.

See [the example](https://github.com/KelkooGroup/theGardener/blob/master/documentation/thegardener.json) in context.


# Page format 

The format of the page respect the [Markdown syntax](https://guides.github.com/features/mastering-markdown/).

Note: to be displayed in theGardener, the Markdown file need to have been listed in the _thegardener.json_ file of the current directory as explained above. 

To **enrich the Markdown syntax**, several additional command can be applied. Those commands use the fact that Markdown syntax accept syntax highlighting: we will had a new language called _thegardener_ with a json format. **We will call refer to those kind of command as module.** Make sure to use ``` before and after the command  (in the current documentation we are using ''' otherwise it would have been escapted at the rendering :) ). 


## Define meta data

At the top of the page, add the following module :
  
````
```thegardener
{
  "page" :
     {
        "label": "Write documentation",
        "description": "How to write documentation with theGardener format ?"
     }
}
```
```` 

- page

   - label: define the text shown on the tab item
   - description: define the title of the page
 

See [the current page](https://github.com/KelkooGroup/theGardener/blob/master/documentation/Write/Basics.md) in context.


## Define an internal link 

Be able to make link to pages in theGardener application.

See [the current page section](https://github.com/KelkooGroup/theGardener/blob/master/documentation/Write/Basics.md) in context.


**To a page in your project:**

Syntax of the link : usual Markdown syntax.

For instance :
- [internal link to installation guide](../Administration/Install.md)  
- [internal link to OpenApi page](./OpenApi.md)  


**To a page outside of your project:**

![](../assets/images/theGardener_role_writer_make_internal_link_01.png)

Copy past the url from 'navigate/' to the end of the url and use it to make the link with the following syntax :

Syntax of the link : thegardener://navigate/{hierarchy}/{project}/{branch}/{directories}/{page}{#anchor}

- only {hierarchy} is mandatory.
- for the branch, use '_' to access to the stable one.

For instance :
[internal link to adoption path from another node in the hierarchy ](thegardener://navigate/_adoption/theGardenerNodes/master/_adoption/adoption)

````
[internal link to adoption path from another node in the hierarchy ](thegardener://navigate/_adoption/theGardenerNodes/master/_adoption/adoption)
````

### Anchors 

Click on the link sign next to titles to add the anchor to the url then make your internal link the same way as before

Example of a Link With Anchor : 
[internal link to the title Data of the installation guide of the project theGardener](thegardener://path=theGardener>master>_guides_/install#data)

## Include external web page

This can be useful to include the Swagger documentation. At the top of the markdown file, use this module :

````
```thegardener
{
  "includeExternalPage" : 
     {
        "url": "http://thegardener.kelkoogroup.net/api/docs/"
     }
}
```
````
 
This external web page will be display at the same place as the other pages. In other word, the text bellow this module will be ignored.  
  
Note that we can use the variables here :

````
```thegardener
{
  "includeExternalPage" : 
     {
        "url": "${swagger.url}/#"
     }
}
```
````



## Use variables

During the configuration of the project in theGardener, we can define variables at project level. This allow to externalise some values that we do not want to hard code in the documentation. For instance, server, urls... 
It can be useful to define swagger documentation urls for example.

For instance :
```json
[
  {"name" : "${swagger.url}", "value" : "http://thegardener.kelkoogroup.net/api/docs/"},
  {"name" : "${headline}" , "value" : "In our documentation we trust."}
]
```

Note: we do not assume of the format of the variable name: it a simple replaceAll in that data at display time of the page.

Implicit variables that are always available :

- *project.current*: the current project name
- *branch.current*: the current branch name
- *branch.stable*: the stable branch name defined at project level

Note: don't forget to surround implicit variables by ${}


