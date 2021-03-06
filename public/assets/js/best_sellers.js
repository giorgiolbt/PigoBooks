$(document).ready(function() {

    function breadCrumbDouble(lastPage, name){
        $("#orderedListBreadCrumb").append('' +
            '<li class="breadcrumb-item"><a href="'+ lastPage.url +'">'+ lastPage.name +'</a></li>' +
            '<li class="breadcrumb-item active" aria-current="page">'+ name +'</li>');
    }

    const name = "Best sellers";
    const url = "best_sellers.html";

    if (!window.sessionStorage.getItem("lastPage")) {
        $("#orderedListBreadCrumb").append('<li class="breadcrumb-item active" aria-current="page">'+ name +'</li>');
    }
    else {
        let lastPage = JSON.parse(window.sessionStorage.getItem("lastPage"));
        if (lastPage.name === name){
            const penultimePage =  JSON.parse(window.sessionStorage.getItem("penultimePage"));
            if (!penultimePage) $("#orderedListBreadCrumb").append('<li class="breadcrumb-item active" aria-current="page">'+ name +'</li>');
            else{
                lastPage = penultimePage;
                breadCrumbDouble(lastPage, name);
            }
        }
        else{
            breadCrumbDouble(lastPage, name);
            window.sessionStorage.setItem("penultimePage",JSON.stringify({url: lastPage.url, name: lastPage.name}));
        }
    }
    window.sessionStorage.setItem("lastPage", JSON.stringify({url: url, name: name}));

    $.ajax({
        type: 'GET',
        url: '/hypermedia2019/api/book/bestSellers',
        datatype: 'json',
        success: function (response) {
            getFirstThreeBooks(response);
        }
    });

    function generateAuthorLinks(authorlist) {
        var j = 0;
        var string = "";
        for (j; j < authorlist.length-1; j++) {
            string = string + '<a class="authorLink" href="author.html?parameter=' + authorlist[j].authorID + '"' + '>' + authorlist[j].firstName + ' ' + authorlist[j].lastName + '</a>' + ', ';
        }
        string = string + '<a  class="authorLink" href="author.html?parameter=' + authorlist[j].authorID + '"' + '>' + authorlist[j].firstName + ' ' + authorlist[j].lastName + '</a>';
        return string;
    }

    function getFirstThreeBooks(response){
        var i = 0;
        const maxBooks=3
        var obj = JSON.stringify(response);
        var jsArray = JSON.parse(obj);
        for (i; i<maxBooks;i++){
            $(".top-books").append('<div class="row featurette">\n' +
                '         <div class="col-md-7 order-md-2">\n' +
                '           <h2 class="featurette-heading"><a class="bestsellerLink" href="book.html?parameter=' + jsArray[i].bookID + '">' + jsArray[i].name + '</a><span class="badge badge-secondary" id="position">' + jsArray[i].placement + '</span></h2>\n' +
                '           <p class="lead">'+ generateAuthorLinks(jsArray[i].authors)
                +'</p>\n' +
                '         </div>\n' +
                '         <div class="col-md-5 order md-1">\n' +
                '           <img class="img-fluid book" src="'+ jsArray[i].image_path +'" alt="book image">\n' +
                '         </div>\n' +
                '       </div>\n' +
                '         <hr class="featurette-divider">')
        }
    }

});