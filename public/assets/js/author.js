$(document).ready(function(){

    function breadCrumbDouble(lastPage, name){
        $("#orderedListBreadCrumb").append('' +
            '<li class="breadcrumb-item"><a href="'+ lastPage.url +'">'+ lastPage.name +'</a></li>' +
            '<li class="breadcrumb-item active" aria-current="page">'+ name +'</li>');
    }

    function createBreadcrumb(name, url){

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
    }

    $.ajax({ //with this GET we receive a json array with the info regarding a particular author in the first position, while in the successive position we have an array containing all the author's books
        type : 'GET',
        url : '/hypermedia2019/api/author/' + getURLQueryParameter(), <!-- + authorid -->
        datatype : 'json',
        success : function (response) {
            var author = JSON.parse(JSON.stringify(response)); //parsing the json object containing the info I need
            createBreadcrumb(author[0].firstName + " " + author[0].lastName, 'author.html?parameter='+ getURLQueryParameter() +'');
            createAuthorPage(author);
        }
    });

    function createBookList(booksarray){  //creates the list of all the books written by a specific author (with the links to each book's page)
        var i = 0;
        var nBooks = booksarray.length;

        for (i; i < nBooks; i++){
            $("#bookList").append('<a href="book.html?parameter=' + booksarray[i].bookID + '" class="list-group-item list-group-item-action">' + booksarray[i].name + '</a>')
        }
    }

    function createAuthorPage(author) {
        document.getElementById("authorName").innerHTML = author[0].firstName + " " + author[0].lastName; //dynamically creating the title
        $("#authorImg").attr("src", author[0].image_path); //adding the author's image
        document.getElementById("shortBio").innerHTML = author[0].shortBio; //adding the author's short biography
        createBookList(author[0].writtenBooks); //filling the list group
    }

    $("#biotext").show();
    $("#book-list").hide();

    //handling the case in which I am on Bio and I press on Books
    $("#books").click(function(){
        $("#bio").removeClass("active");
        $("#books").addClass("active");
        $("#book-list").show();
        $("#biotext").hide();
    });

    //handling the case in which I am on Books and I press on Bio
    $("#bio").click(function(){
        $("#books").removeClass("active");
        $("#bio").addClass("active");
        $("#biotext").show();
        $("#book-list").hide();
    });
});