var options = {
  accessibility: true,
  prevNextButtons: true,
  pageDots: true,
  setGallerySize: false,
  autoPlay: 1500,
  pauseAutoPlayOnHover: false,
  arrowShape: {
    x0: 10,
    x1: 60,
    y1: 50,
    x2: 60,
    y2: 45,
    x3: 15,
  },
};

var carousel = document.querySelector("[data-carousel]");
var slides = document.getElementsByClassName("carousel-cell");
var flkty = new Flickity(carousel, options);

flkty.on("scroll", function () {
  flkty.slides.forEach(function (slide, i) {
    var image = slides[i];
    var x = ((slide.target + flkty.x) * -1) / 3;
    image.style.backgroundPosition = x + "px";
  });
});
$(document).ready(function () {
  function slider(slide, points, arrows, time) {
    this.slide = slide;
    this.pointsWrap = points.find("ul");
    this.points = this.pointsWrap.find("li");
    this.count = this.slide.children().length;
    this.cur = 0;
    this.Time = time;
    this.nextCount = 0;
    this.prevCount = this.count - 1;
    this.maxlength = this.count * 100;
    this.arrows = arrows;
    this.interval = 0;
  }

  //active point reset
  slider.prototype.pointSelect = function (e, obj) {
    this.points.removeClass("active");
    this.points.eq(e).addClass("active");
  };

  //automatic slider

  slider.prototype.slideinterval = function (obj) {
    this.cur = (this.cur + 1) % this.count;
    length = this.cur * 100;
    slide = this.slide;

    slide.animate({ marginLeft: "-" + length + "%" });
  };

  //pointsclicking slide
  slider.prototype.pointclicked = function (obj, i) {
    var cur = this.points.index(i),
      length = cur * 100;
    // alert(cur);
    this.pointSelect(cur);
    this.slide.animate({ marginLeft: "-" + length + "%" });
  };

  //effect for the arrows slideing
  slider.prototype.slideEffect = function (e, count) {
    var currentSlide = count * 100;

    if (e === "next") {
      this.slide.animate({ marginLeft: "-" + currentSlide + "%" });
      this.pointSelect(count);
    }
    if (e === "prev") {
      this.slide.animate({ marginLeft: "-" + currentSlide + "%" });
      this.pointSelect(count);
    }
  };
  //arrow clicking slide
  slider.prototype.arrowclicked = function (obj, e) {
    this.nextCount += 1;
    var direction = $(e).data("dir"),
      max = this.count;
    // alert(direction);
    this.nextCount < max ? this.nextCount : (this.nextCount = 0);
    this.prevCount > -1 ? this.prevCount : (this.prevCount = max - 1);

    direction === "next"
      ? this.slideEffect("next", this.nextCount)
      : this.slideEffect("prev", this.prevCount);

    this.prevCount -= 1;
  };

  //rendering all functions
  slider.prototype.render = function () {
    var obj = this,
      tm = obj.Time,
      clear = function () {
        clearInterval(obj.interval);
      };
    inter = function () {
      obj.slideinterval(obj);
    };
    obj.interval = setInterval(function () {
      inter();
    }, tm);
  };
  /*
   ******************************
   *=object end
   ******************************
   */

  $(".slider").css("overflow", "hidden");
  $("body").css("overflow", "hidden");

  var carousel = new slider($(".slider"), $(".points"), $(".arrow"), 2000);
  carousel.render();
});

(function ($) {
  $(document).ready(function () {
    $.ajax({
      url:
        "https://api.flickr.com/services/rest/?method=flickr.galleries.getPhotos&api_key=9470b16874d875b9b759725139ffc448&gallery_id=72157666222357401&per_page=10&format=json&nojsoncallback=1",
      type: "GET",
      success: function (data) {
        console.log("api successfully called");

        var path = data.photos.photo;
        //for each photo, I save the different individual ids into variables so that they can be easily plugged into a URL
        for (var i = 0; i < path.length; i++) {
          var obj = path[i];
          var farm_id = data.photos.photo[i].farm;
          var server_id = data.photos.photo[i].server;
          var photo_id = data.photos.photo[i].id;
          var secret = data.photos.photo[i].secret;

          //the static address to photos on Flickr is accessed through this address: https://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}.jpg
          //this variable is the direct link to access photos on Flickr, minus the ".jpg" designation that will be added, according to whether we are trying to access the medium picture or the large picture
          var pic_url =
            "https://farm" +
            farm_id +
            ".staticflickr.com/" +
            server_id +
            "/" +
            photo_id +
            "_" +
            secret;

          //this is the variable that stores the medium jpeg URL
          var pic_url_m = pic_url + "_m.jpg";

          //this stores an image tag which will be populated with a medium jpeg URL
          var pic_img = "<img src='" + pic_url_m + '\' alt = "pic" />';

          //this appends the var pic_img to the photo_list div as the function loops through

          //$('.body').append('#frame');
          $("#photo-list").append(pic_img);

          //this appends the class "paginate" to each img tag that is formed, ensuring that the the divs get passed to a later function called customPaginate
          //  $('img').addClass("paginate")
          $("#photo-list img").addClass("paginate");
        }

        //this passes all divs with the class "pagination" to the function customPaginate
        $(".pagination").customPaginate({
          itemsToPaginate: ".paginate",
        });

        //when img tags with the class paginate are clicked, the following function is called
        $(".paginate").click(function () {
          //this variable saves the "src" or URL of (this) which is any element with the class "paginate"
          var src = $(this).attr("src");

          //this variable takes the "src" variable, slices the last six characters, and replaces it with "_c.jpg", a large version of the image URL
          var src_l = src.slice(0, -6) + "_c.jpg";

          //ideally, I would also write functions that retrieve the actual height and width of the larger version of the image, and temporarily assign them to the #frame img tag so the user can see the true height and width of the images
          //the below commented code is my attempt to grab this information, but I was not able to get it work successfully
          //   $('#frame img').on('load', function(e) {
          //   e.('#frame img').style.width = e.('#frame img').naturalWidth + 'px';
          //   e.('#frame img').style.height = e.('#frame img').naturalHeight + 'px';
          //   $(this).fadeIn();
          //   $('#overlay').fadeIn();
          // })

          //gives the "frame img" element a new attribute, which is the large image URL
          $("#frame img").attr("src", src_l);

          //allows the the "frame img" element to fade into the screen
          $("#frame img").fadeIn();

          //allows the "overlay" element to fade onto the screen
          $("#overlay").fadeIn();

          //when the "overlay" element is clicked, both the "overlay" and "frame img" elements
          $("#overlay").click(function () {
            $(this).fadeOut();
            $("#frame img").fadeOut();

            //removes the "src" attribute from "frame img", allowing it to be populated by other image URLs next time an image is clicked
            $("#frame img").removeAttr("src");
          });
        });
      },
    });
  });

  //this function generates the customPaginate function, which paginates the images 10 to a page
  $.fn.customPaginate = function (options) {
    var paginationContainer = this;

    var defaults = {
      //sets how many items to a page
      itemsPerPage: 10,
    };

    var settings = {};

    //merges defaults and options into one one variable, settings
    $.extend(settings, defaults, options);

    //sets how many items will be on each page
    var itemsPerPage = settings.itemsPerPage;

    //sets which items are going to be
    var itemsToPaginate = $(settings.itemsToPaginate);

    //determines how many pages to generate based on the amount of items
    var numberOfItems = Math.ceil(itemsToPaginate.length / itemsPerPage);

    //this ul will contain the page numbers
    $("<ul></ul>").prependTo(paginationContainer);

    //loops through the ul tag the same number of times as there are pages. in this case, the loop will run 4 times
    for (var index = 0; index < numberOfItems; index++) {
      paginationContainer.find("ul").append("<li>" + (index + 1) + "</li>");
    }

    //ensures that the current page only displays the items that should be on the specific page, and hides the others
    itemsToPaginate.filter(":gt(" + (itemsPerPage - 1) + ")").hide();

    //locates the first li element, adds activeClass element to it
    paginationContainer
      .find("ul li")
      .first()
      .addClass(settings.activeClass)
      .end()
      .on("click", function () {
        var $this = $(this);

        //gives current page the activeClass setting
        $this.addClass(settings.activeClass);

        //takes activeClass setting away from non-current pages
        $this.siblings().removeClass(settings.activeClass);

        var pageNumber = $this.text();

        //this variable designates that items located on the previous page times the number of items per page should be hidden
        var itemsToHide = itemsToPaginate.filter(
          ":lt(" + (pageNumber - 1) * itemsPerPage + ")"
        );

        //this function merges itemsToHide and itemsToPaginate that are greater than the product of the pageNumber and the itemsPerPage minus 1, ensuring that these items are hidden from view
        $.merge(
          itemsToHide,
          itemsToPaginate.filter(":gt(" + (pageNumber * itemsPerPage - 1) + ")")
        );

        //designates these items as items that should be shown on the current page
        var itemsToShow = itemsToPaginate.not(itemsToHide);

        //hides items from other pages and shows items from current page
        $("html,body").animate({ scrollTop: "0px" }, function () {
          itemsToHide.hide();
          itemsToShow.show();
        });
      });
  };
})(jQuery);
