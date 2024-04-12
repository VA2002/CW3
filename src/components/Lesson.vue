<template>
  <!--Lesson page-->
  <div id="Homepage">
    <div class="Navigation">
      <!--Cart button with a disabled condition if the cart is empty-->
      <button id="Cart" @click="handleCartButtonClick" :disabled="cart.length === 0">
        <i class="fa-solid fa-cart-shopping"></i>
      </button>
      <br>
      <img id="Websitelogo" src="../../public/thelogo.png" alt="Logo">
    </div>
    <br>
    <br>
    <!--This contains all the filters-->
    <div class="Sortbox">
      <br>
      <center>
        <h1 id="Sortby">Sort by :</h1>
        <br>
        <br>
        <!--@click added to buttons to define the function they have-->
        <div id="Filters">
          Subject:
          <button class="Ascdesc" id="Nameup" @click="nameAsc">
            <i class="fa-solid fa-arrow-up"></i>
          </button>
          <button class="Ascdesc" id="Namedown" @click="nameDesc">
            <i class="fa-solid fa-arrow-down"></i>
          </button>
          <br>
          <br>Location:
          <button class="Ascdesc" id="Locationup" @click="locationAsc">
            <i class="fa-solid fa-arrow-up"></i>
          </button>
          <button class="Ascdesc" id="Locationdown" @click="locationDesc">
            <i class="fa-solid fa-arrow-down"></i>
          </button>
          <br>
          <br>Fee:
          <button class="Ascdesc" id="Priceup" @click="priceAsc">
            <i class="fa-solid fa-arrow-up"></i>
          </button>
          <button class="Ascdesc" id="Pricedown" @click="priceDesc">
            <i class="fa-solid fa-arrow-down"></i>
          </button>
          <br>
          <br>Teacher:
          <button class="Ascdesc" id="Teacherup" @click="teacherAsc">
            <i class="fa-solid fa-arrow-up"></i>
          </button>
          <button class="Ascdesc" id="Teacherdown" @click="teacherDesc">
            <i class="fa-solid fa-arrow-down"></i>
          </button>
          <br>
          <br>Availability:
          <button class="Ascdesc" id="Spaceup" @click="spaceAsc">
            <i class="fa-solid fa-arrow-up"></i>
          </button>
          <button class="Ascdesc" id="Spacedown" @click="spaceDesc">
            <i class="fa-solid fa-arrow-down"></i>
          </button>
        </div>
      </center>
    </div>
    <br>
    <!--Search bar-->
    <input
      type="text"
      id="Search"
      placeholder="Search Subject Name, Code, Location or Teacher Here..."
      v-model="searchTerm"
    >
    <!--Div for viewing lessons-->
    <div class="Theclasses">
      <table id="Classtable" cellspacing="15">
        <tr v-for="(row, rowIndex) in lessonRows" :key="rowIndex">
          <td v-for="(lesson, lessonIndex) in row" :key="lessonIndex">
            <div class="Subjectbox" v-if="matchSearch(lesson)">
              <div id="Subjectname">{{ lesson.code }}: {{ lesson.name }}</div>
              <div v-html="lesson.fontawsm"></div>
              <div id="Subjectinfo">
                <b>Location:</b>
                {{ lesson.location }}
                <br>
                <b>Fee:</b>
                £ {{ lesson.price }}
                <br>
                <b>Teacher:</b>
                {{ lesson.teacher }}
                <br>
                <b>Space:</b>
                <span v-if="lesson.space > 0">{{ calculateSpaceLeft(lesson) }}</span>
                <span v-else>
                  <span style="color: rgb(158, 32, 32);">Unavailable</span>
                </span>
                <br>
              </div>
              <br>
              <!--Add to cart button for each class-->
              <button
                class="Addtocart"
                :id="lesson.name"
                @click="addToCart(lesson)"
                :disabled="calculateSpaceLeft(lesson) === 0"
              >
                <i class="fa-solid fa-cart-plus"></i> Add To Cart
              </button>
            </div>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
//Vue instance
export default {
  //Naming component
  name: "Lesson-Component",
  //Calling props from parent
  props: {
    cart: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      searchTerm: "",
      lessons: [] // Initialize an empty array to store the lessons data
    };
  },
  methods: {
    handleCartButtonClick() {
      //Emit an event to App.vue to switch to Cart.vue component
      this.$emit("change-component", "Cart");
    },
    //Sorting methods
    nameAsc() {
      this.lessons.sort((a, b) => a.name.localeCompare(b.name));
    },
    nameDesc() {
      this.lessons.sort((a, b) => b.name.localeCompare(a.name));
    },
    locationAsc() {
      this.lessons.sort((a, b) => a.location.localeCompare(b.location));
    },
    locationDesc() {
      this.lessons.sort((a, b) => b.location.localeCompare(a.location));
    },
    priceAsc() {
      this.lessons.sort((a, b) => a.price - b.price);
    },
    priceDesc() {
      this.lessons.sort((a, b) => b.price - a.price);
    },
    teacherAsc() {
      this.lessons.sort((a, b) => a.teacher.localeCompare(b.teacher));
    },
    teacherDesc() {
      this.lessons.sort((a, b) => b.teacher.localeCompare(a.teacher));
    },
    spaceAsc() {
      this.lessons.sort((a, b) => a.space - b.space);
    },
    spaceDesc() {
      this.lessons.sort((a, b) => b.space - a.space);
    },
    //Your search method here
    matchSearch(lesson) {
      const searchTerm = this.searchTerm.toLowerCase();
      //Check if any field matches the search term
      return (
        lesson.name.toLowerCase().includes(searchTerm) ||
        lesson.code.toLowerCase().includes(searchTerm) ||
        lesson.location.toLowerCase().includes(searchTerm) ||
        lesson.teacher.toLowerCase().includes(searchTerm)
      );
    },
    addToCart(lesson) {
      //Emit a custom event "add-to-cart" with the lesson data
      if (lesson && lesson.cartqty !== undefined && lesson.space > 0) {
        console.log(lesson);
        this.$emit("add-to-cart", lesson);
      } else {
        console.error("Invalid lesson object:", lesson);
      }
    },
    calculateSpaceLeft(lesson) {
      //Find the cart item corresponding to this lesson
      const cartItem = this.cart.find(item => item._id === lesson._id);
      if (cartItem) {
        //If the lesson is in the cart, subtract its cart quantity from its initial space
        return lesson.space - cartItem.cartqty;
      } else {
        //If the lesson is not in the cart, return its initial space
        return lesson.space;
      }
    }
  },
  created() {
    //Make an HTTP GET request to fetch the lessons data from the backend
    fetch("http://localhost:3000/collection/Lessons")
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(data => {
        this.lessons = data; //Update the lessons data with the response data
        console.log(data);
      })
      .catch(error => {
        console.error("Error fetching lessons:", error);
      });
  },
  computed: {
    lessonRows() {
      //Group lessons into arrays of three
      const rows = [];
      for (let i = 0; i < this.lessons.length; i += 3) {
        rows.push(this.lessons.slice(i, i + 3));
      }
      return rows;
    }
  }
};
</script>

<style>
</style>
