// global variables
var serverURL="http://localhost:8080/API/";
var items = [];

function init(){
    console.log('Testing admin')
    $("#btn-register").on('click',function(){
        register();
    })
}

window.onload = init;

//object constructor
class Item{
    constructor(code,title,price,description,category,image){
        this.code=code;
        this.title=title;
        this.price=price;
        this.description=description;
        this.category=category;
        this.image=image;
        this.user="Briun";
    }
}

//register function

function register(){
    //get the values from the form
    var  code=$('#code').val();
    var  title=$('#title').val();
    var  price=$('#price').val();
    var  description=$('#description').val();
    var  category=$('#category').val();
    console.log(category)
    var  image=$('#image').val();
    //create the object

    if(code!='' && title!='' && price!=''){ //no empty values
        var newItem = new Item(code,title,price,description,category,image);
    //push the item to the items array
    items.push(newItem);
    var jsonString = JSON.stringify(newItem);
    //display the item on the console
    console.log(newItem);
    console.log(jsonString);
    

    }else{
        alert("Please include at minimum the code, title, and price");
    }
    
    // $.ajax({}) original ajax function
    $.ajax({
        url:serverURL+"items",
        type:"POST",
        contentType:"application/json",
        data:jsonString,
        success:function(response){
            console.log("it worked", response);
            $("#alert-box").removeClass("hidden");
            //hide the notification after an interval
            setTimeout(function(){
                $("#alert-box").addClass("hidden")
            },3000);
            // $("#alert-box").fadeOut(3000);
            // $("#alert-box").addClass("hidden");
        },
        error:function(errorDetails){
            console.log("Something went wrong...", errorDetails)
        }
    }); 

    clear();
}

function clear(){
    $('#code').val('');
    $('#title').val('');
    $('#price').val('');
    $('#description').val('');
    $('#category').val('');
    $('#image').val('');
}