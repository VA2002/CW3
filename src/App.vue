<template>
  <!-- App will be mounted here -->
  <div id="app">
  <!-- Lesson component, the landing page -->    
    <Lesson
      v-if="currentComponent === 'Lesson'"
      @change-component="handleChangeComponent"
      @add-to-cart="addToCartHandler"
      :cart="cart"
      @cart-empty="isCartEmpty"
      @perform-search="performSearch"
      :lessons="filteredLessons"
    />
    <!-- Cart component -->    
    <Cart
      v-if="currentComponent === 'Cart'"
      @change-component="handleChangeComponent"
      @delete-from-cart="deleteFromCartHandler"
      @update-total="updateTotalAmt"
      @update-cart="updateCart"
      :cart="cart"
      :totalAmt="totalAmt"
    />
    <!-- Checkout component -->    
    <Checkout
      v-if="currentComponent === 'Checkout'"
      @change-component="handleChangeComponent"
      @update-total="updateTotalAmt"
      :cart="cart"
      :totalAmt="totalAmt"
    />
  </div>
</template>

<script>
//Importing components
import Lesson from "./components/Lesson.vue";
import Cart from "./components/Cart.vue";
import Checkout from "./components/Checkout.vue";

//Vue instance
export default {
  name: "App",
  components: {
    Lesson,
    Cart,
    Checkout
  },
  data() {
    return {
      currentComponent: "Lesson",
      lessons: [], //Storing lessons
      cart: [], //Storing cart items
      searchTerm: "",
      totalAmt: 0 //Initialize totalAmt
    };
  },
  computed: {
    filteredLessons() {
      //Filter lessons based on the search term
      return this.lessons.filter(lesson =>
        lesson.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    },
    cartItemCount() {
      return this.cart.length;
    }
  },
  methods: {
    handleChangeComponent(component) {
      this.currentComponent = component;
    },
    addToCartHandler(lesson) {
      //Finding the index of the lesson in the cart array
      const index = this.cart.findIndex(item => item._id === lesson._id);

      if (index === -1) {
        //Lesson not found in cart, add it with cartqty set to 1
        this.cart.push({
          ...lesson,
          cartqty: 1
        });
        alert(`Added ${lesson.name} to cart`);
      } else {
        //Lesson found in cart, increment its cartqty
        this.cart[index].cartqty++;
      }

      //Recalculate totalAmt
      this.calculateTotalAmt();
    },

    deleteFromCartHandler(cartItemToDelete) {
      // Find the index of the item to delete
      const indexToDelete = this.cart.findIndex(
        item => item._id === cartItemToDelete._id
      );
      if (indexToDelete !== -1) {
        //Remove the item from the cart array
        this.cart.splice(indexToDelete, 1);
        //Recalculate totalAmt
        this.calculateTotalAmt();
        //Optionally, perform any other actions related to item deletion
      }
    },
    isCartEmpty() {
      //Check if the cart is empty
      return this.cart.length === 0;
    },
    performSearch() {
      //To ensure search is not case sensitive
      const searchTerm = this.searchTerm.toLowerCase();

      //In case there is no search term
      if (!searchTerm) {
        fetch("http:/localhost:3000/collection/Lessons")
          .then(response => response.json())
          .then(data => {
            this.lessons = data;
          })
          //Exception handling to handle errors
          .catch(error => console.log("There seems to be an error: ", error));
      }
      //If there is a search term, make a request to the backend to fetch results
      else {
        const collection = "Lessons";
        //Fetch the lesson with the associated searchterm (whether it is lesson name, location, teacher, or code)
        fetch(`http:/localhost:3000/${collection}/search/${searchTerm}`)
          .then(response => {
            //Error handling
            if (!response.ok) {
              throw new Error("Network response Error");
            }
            return response.json();
          })
          .then(data => {
            //Update the classes array with the search results from the backend
            this.classes = data;
            console.log("Results: \n", data);
          })
          .catch(error => {
            console.error("ERROR:", error);
            //Handle error 
          });
      }
    },
    handleFormSubmission(submission) {
      //Make a POST request to submit the form data
      fetch("http://localhost:3000/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(submission)
      })
        .then(response => {
          if (!response.ok) {
            alert("Error");
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then(data => {
          //Handle success response
          alert("Submitted");
          console.log("Order placed successfully:", data);
          this.cart.forEach(item => {
            this.updateLessonSpace(item._id, item.cartqty);
          });
          //Optionally, perform any other action
        })
        .catch(error => {
          //Handle error
          console.error("Error placing order:", error);
        });
    },
    updateLessonSpace(lessonId, cartQty) {
      //Fetch the lesson details for the given lessonId
      fetch(`http://localhost:3000/collection/Lessons/${lessonId}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then(lesson => {
          //Calculate the new space value based on the cart quantity
          const newSpaceVal = lesson.space - cartQty;

          //Update the lesson space using a PUT request
          fetch(`http://localhost:3000/collection/Lessons/${lessonId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ space: newSpaceVal })
          })
            .then(response => response.json())
            .then(data => {
              console.log("Lesson space updated successfully: ", data);
            })
            .catch(error => {
              console.error("Error updating lesson space: ", error);
            });
        })
        .catch(error => {
          console.error("ERROR:", error);
        });
    },
    calculateTotalAmt() {
      this.totalAmt = this.cart.reduce(
        (total, cartItem) => total + cartItem.price * cartItem.cartqty,
        0
      );
    },
    updateTotalAmt(newTotalAmt) {
      this.totalAmt = newTotalAmt;
    }
  }
};
</script>

<style>
/*Styling*/
.Navigation {
  background-color: rgb(42, 70, 121);
  width: 101.5%;
  height: 20%;
  margin-left: -1%;
  margin-top: -0.8%;
  box-shadow: 3px 3px 3px black;
  z-index: 20;
  position: fixed;
}

.Navlink {
  text-decoration: none;
  color: white;
  font-family: "Bahnschrift Semibold";
  font-size: 18px;
}

#Websitelogo {
  width: 20%;
  height: 100%;
  margin-top: -7.4%;
  margin-left: 1%;
}

#Search {
  background-color: rgb(246, 246, 246);
  font-family: "Courier New", Courier, monospace;
  font-size: 14px;
  border-width: 0.2px;
  border-radius: 30px;
  width: 75%;
  height: 34px;
  margin-top: 6%;
  margin-left: 23%;
}

#Searchbar {
  width: 34%;
  height: 40%;
  background-color: rgb(251, 251, 251);
  font-family: "Courier New", Courier, monospace;
  font-size: 16.5px;
  border-width: 0.4px;
  border-radius: 30px;
  margin-left: 32%;
  margin-top: -773337%;
}

#Searchbutton {
  margin-left: 63%;
  margin-top: -20%;
  cursor: pointer;
}

#Cart {
  margin-top: 2.7%;
  margin-left: 90%;
  width: 5%;
  height: 48%;
  background-color: rgb(255, 255, 255);
  color: rgb(18, 146, 221);
  border-color: rgb(18, 146, 221);
  font-size: 30px;
  border-radius: 40px;
  border-width: 2px;
  border-style: solid;
  cursor: pointer;
}

#Cart:hover {
  background-color: rgb(18, 146, 221);
  color: rgb(255, 255, 255);
  border-color: rgb(255, 255, 255);
  box-shadow: 2px 2px 20px white;
  transition: 0.4s;
}

#Cart:disabled {
  cursor: not-allowed;
  opacity: 80%;
  background-color: rgb(185, 185, 185);
  filter: brightness(80%);
}

.Theclasses {
  overflow: auto;
  height: 100%;
  width: 78.9%;
  margin-left: 21%;
  margin-top: 1%;
}

.Subjectbox {
  background-color: rgb(251, 251, 251);
  border-width: 1px;
  border-style: groove;
  border-radius: 10px;
  font-size: 14px;
  font-family: "bahnschrift";
  box-shadow: 2px 2px 5px black;
  width: 320px;
  height: 200px;
  animation: appear 1s;
}

#Subjectname {
  color: rgb(42, 82, 158);
  font-size: 19.5px;
  margin-left: 38%;
  margin-top: 5%;
}

.Addtocart {
  background-color: rgb(53, 72, 180);
  border-style: solid;
  border-color: rgb(243, 243, 243);
  border-width: 3.4px;
  border-radius: 15px;
  color: white;
  width: 50%;
  height: 20%;
  font-size: 18px;
  margin-left: 39.5%;
  margin-top: -2%;
  text-align: center;
  font-family: "bahnschrift";
  cursor: pointer;
}

.Addtocart:hover {
  color: rgb(53, 72, 180);
  border-color: rgb(53, 72, 180);
  background-color: white;
  transition: 0.6s;
}

.Addtocart:disabled {
  cursor: not-allowed;
  opacity: 80%;
  background-color: rgb(185, 185, 185);
  filter: brightness(80%);
}

#Subjectinfo {
  margin-left: 45%;
  margin-top: -20%;
}

#Subjecticon {
  font-size: 60px;
  margin-left: 10%;
  margin-top: 7%;
}

.Sortbox {
  background-color: rgb(245, 245, 245);
  width: 20%;
  height: 480px;
  margin-top: 7%;
  margin-left: 0%;
  font-family: "bahnschrift semibold";
  position: fixed;
}

#Sortby {
  font-family: "bahnschrift";
}

.Ascdesc {
  background-color: rgb(38, 105, 182);
  color: white;
  font-size: 12px;
  width: 12%;
  height: 10%;
  border-color: white;
  border-radius: 40px;
}

.Ascdesc:hover {
  color: rgb(38, 105, 182);
  background-color: white;
  border-color: rgb(38, 105, 182);
  transition: 0.3s;
}

#Thecart {
  background-color: rgb(251, 251, 251);
  width: 28%;
  height: 79.1%;
  margin-top: 6%;
  margin-left: 71.3%;
  position: fixed;
  overflow: auto;
  font-family: "Bahnschrift";
  z-index: 18;
  display: none;
  animation: slidein 0.5s;
}

#Black {
  background-color: black;
  opacity: 80%;
  width: 101.2%;
  height: 505.9px;
  margin-top: 5.9%;
  margin-left: -0.6%;
  z-index: 1;
  position: fixed;
  display: none;
  animation: fadein 1s;
}

#Cartpage {
  height: 625px;
  width: 101.5%;
  background-image: linear-gradient(
    to bottom right,
    rgb(27, 81, 180),
    rgb(102, 149, 238)
  );
  margin-left: -1%;
  margin-top: -0.6%;
}

.Classesincart {
  border-color: rgb(30, 60, 143);
  border-style: solid;
  width: 71%;
  margin-left: 7%;
  margin-top: -15.8%;
  border-radius: 10px;
}

.Cartitems {
  overflow: auto;
  font-family: "Bahnschrift";
  background-color: white;
  margin-top: 3%;
  margin-left: 2%;
  width: 50%;
  height: 480px;
  border-radius: 16px;
  box-shadow: 1px 1px 5px black;
}

.Cartinfo {
  margin-left: 9%;
}

.Cartsubject {
  color: rgb(42, 82, 158);
  font-size: 21px;
}

.Qty .Price {
  font-size: 12.5px;
}

.Delete {
  margin-left: 77%;
  margin-top: 1.1%;
  font-family: "Bahnschrift";
  font-size: 25px;
  width: 14%;
  height: 108px;
  color: white;
  background-color: rgb(151, 27, 27);
  border-color: rgb(218, 218, 218);
  border-style: solid;
  border-radius: 10px;
}

.Delete:hover {
  background-color: rgb(175, 53, 53);
  color: white;
  border-color: rgb(151, 27, 27);
  transition: 0.5s;
}

#Qtyup,
#Qtydown {
  background-color: rgb(38, 105, 182);
  color: white;
  font-size: 12px;
  width: 5%;
  height: 10%;
  border-color: white;
  border-radius: 40px;
}

#Qtyup:hover,
#Qtydown:hover {
  color: rgb(38, 105, 182);
  background-color: white;
  border-color: rgb(38, 105, 182);
  transition: 0.3s;
}

#Qtyup:disabled,
#Qtydown:disabled {
  filter: brightness(80%);
  background-color: gray;
}

#Back {
  color: white;
  font-size: 30px;
}

#Back:hover {
  color: rgb(238, 238, 238);
  transition: 0.4s;
}

.Total {
  font-family: "Bahnschrift";
  font-size: 24px;
  margin-top: -39%;
  margin-left: 58%;
  width: 38%;
  height: 200px;
  border-radius: 16px;
  background-color: white;
  box-shadow: 1px 1px 5px black;
}

#Checkoutbutton {
  cursor: pointer;
  font-family: "Bahnschrift";
  font-size: 20px;
  background-color: rgb(250, 222, 62);
  color: rgb(133, 102, 24);
  border-color: rgb(133, 102, 24);
  border-width: 2px;
  border-style: solid;
  border-radius: 15px;
  width: 70%;
  height: 50px;
  margin-top: -2%;
}

#Checkoutbutton:hover {
  background-color: rgb(133, 102, 24);
  color: rgb(250, 222, 62);
  border-color: rgb(250, 222, 62);
  box-shadow: 2px 2px 15px rgb(255, 232, 103);
  transition: 0.3s;
}

#Checkoutbutton:disabled {
  cursor: not-allowed;
  opacity: 80%;
  background-color: rgb(185, 185, 185);
  filter: brightness(80%);
}

#Checkoutpage {
  height: 625px;
  width: 101.5%;
  background-image: linear-gradient(
    to bottom right,
    rgb(27, 81, 180),
    rgb(102, 149, 238)
  );
  margin-left: -1%;
  margin-top: -0.3%;
  z-index: 18;
}

.Theform {
  overflow: auto;
  font-family: "Bahnschrift";
  background-color: white;
  margin-top: 3%;
  margin-left: 2%;
  width: 70%;
  height: 530px;
  border-radius: 16px;
  box-shadow: 1px 1px 5px black;
}

#FName,
#MName,
#LName {
  background-color: rgb(241, 241, 241);
  height: 38px;
  border-style: none;
  font-family: "Courier New", Courier, monospace;
  width: 24.6%;
}

#Cardnumber,
#Cardexpiry,
#CardCVV {
  background-color: rgb(241, 241, 241);
  height: 38px;
  border-style: none;
  font-family: "Courier New", Courier, monospace;
  width: 37%;
}

#StudentID,
#Phone,
#Email {
  background-color: rgb(241, 241, 241);
  height: 38px;
  border-style: none;
  font-family: "Courier New", Courier, monospace;
  width: 75%;
}

#Submitform {
  width: 30%;
  height: 37px;
  background-color: rgb(57, 92, 207);
  border-color: rgb(24, 46, 121);
  border-style: solid;
  border-width: 3.5px;
  font-family: "Bahnschrift";
  color: white;
  font-size: 20px;
  margin-top: -1.5%;
}

#Submitform:hover {
  background-color: white;
  color: rgb(24, 46, 121);
  border-color: rgb(24, 46, 121);
  transition: 0.5s;
}

#Submitform:disabled {
  cursor: not-allowed;
  background-color: rgb(185, 185, 185);
  filter: brightness(80%);
  border-color: gray;
}

@keyframes fadein {
  0% {
    opacity: 0%;
  }
  100% {
    opacity: 80%;
  }
}

@keyframes fadeintwo {
  0% {
    opacity: 0%;
  }
  100% {
    opacity: 100%;
  }
}

@keyframes slidein {
  0% {
    margin-left: 100%;
  }
  100% {
    margin-left: 71.3%;
  }
}

@keyframes appear {
  0% {
    opacity: 0%;
    width: 300px;
  }
  100% {
    opacity: 100%;
    width: 320px;
  }
}
</style>


