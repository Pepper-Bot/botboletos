 function parentCategories() {

     /*1	Sports
     2	Baseball
     7	Basketball
     15	Hockey
     19	Football
     24	Golf
     27	Auto Racing
     34	Soccer
     44	Fighting
     49	Extreme Sports
     51	International Games
     54	Concerts
     68	Theatre
     73	Special Events
     78	Lacrosse*/

     var parentCategories = [];
     var Sports = [1, 2, 7, 15, 19, 24, 27, 34, 44, 49, 51, 78];

     var parentCategories = [{
             "Sports": [{
                     "id": "1",
                     "name": "Sports"
                 },
                 {
                     "id": "2",
                     "name": "Baseball"
                 },
                 {
                     "id": "7",
                     "name": "Basketball"
                 },
                 {
                     "id": "15",
                     "name": "Hockey"
                 },
                 {
                     "id": "19",
                     "name": "Football"
                 },
                 {
                     "id": "24",
                     "name": "Golf"
                 },
                 {
                     "id": "27",
                     "name": "Auto Racing"
                 },
                 {
                     "id": "34",
                     "name": "Soccer"
                 },
                 {
                     "id": "44",
                     "name": "Fighting"
                 },
                 {
                     "id": "49",
                     "name": "Extreme Sports"
                 }

                 ,
                 {
                     "id": "51",
                     "name": "International Games"
                 },
                 {
                     "id": "78",
                     "name": "Lacrosse"
                 }

             ]
         },


         {
             "id": "54",
             "name": "Concerts"
         },
         {
             "id": "68",
             "name": "Theatre"
         },
         {
             "id": "73",
             "name": "Special Events"
         }



     ];

     return parentCategories;

 }


 function searchParentCategoryByName(name) {
     var parentCategories = parentCategories();
     var temp = 0;
     for (var i = 0; i < parentCategories.length; i++) {

         if (parentCategories[i].Sports) {
             text = "Sports";
         } else {
             text = parentCategories[i].name;
         }

         if (name == text) {
             temp = i;
             break;
         }

     }

     return parentCategories[temp];
 }


 module.exports = {
     parentCategories,
     searchParentCategoryByName

 }