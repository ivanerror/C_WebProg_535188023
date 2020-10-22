
// import { createClient } from 'pexels';

// const client = createClient('563492ad6f91700001000001fdc65a49dc3246689ac0e6d908e96916');
// const query = 'Nature';

// client.photos.search({ query, per_page: 1 }).then(photos => {
//     console.log(photos)
// });



// var accessKey = 'pbZSAjCNa2x5tIWzNcvqT5rjCGNXDVt0-1KDtw07zns'

// let url =
//         "https://api.unsplash.com/photos/random/?client_id=" +
//         accessKey + "&count=2"
//         // "&query="
//         // searchTerm +
//         // "&page="

//       // Request\


var data = {
      url : "http://api.pexels.com/v1/search?query=tiger",
      headers: {
        'Authorization': '563492ad6f91700001000001fdc65a49dc3246689ac0e6d908e96916'
      } 
   }

   console.log(data)

function createCell(element) {
      var myBox = $("<div class='box'></div>")
      var imgBx = $("<div class='imgBx'></div>")
      const imageUrl = element.urls.full
      imgBx.append($(`<img src="${imageUrl}" class="img-fluid mt-2 mb-2"/>`))


      myBox.append(imgBx)


      // console.log(imageUrl)
}

// fetch(url)
//     .then(function(data) {
//           return data.json();
//     })
//     .then(function(data) {
//          data.forEach(element => {
//             //   createCell(element)
//             console
//           });
//      });


