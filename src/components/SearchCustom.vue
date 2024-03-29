<template>
  <div class="wrapper">
    <div class="search__left">
      <div v-if= "tags && tags.length" class="search__select" :class="isOpen ? 'search__select--open' : ''" @click="isOpen = !isOpen">
        <p v-if="!selectedTagId" class="select__name">Danh sách tag</p>
        <p v-else class="select__name">{{ tags.find(tag => tag.id === selectedTagId).name }}</p>
        <ul class="search__dropdown">
          <li class="search__option" @click="selectTag(0)">
            Danh sách tag
          </li>
          <li v-for="tag in tags" :key="tag.id" class="search__option" @click="selectTag(tag.id)">
            {{ tag.name }}
          </li>
        </ul>
        <i class="fa" :class="isOpen ? 'fa-chevron-down' : 'fa-chevron-up'" aria-hidden="true"></i>
      </div>
      <input id="key_search" v-model="keyword" autocomplete="off" class="search__input" name="key"
             :placeholder="searchContent" :style="{
                width: tags && tags.length ? '373px' : '543px',
             }">
    </div>

    <div class="search__image search__right" @click="$emit('submit', selectedTagId, keyword)">
      <img src="img/theme/search.svg" class="w-100" alt="">
    </div>
  </div>

</template>

<script>
export default {
  name: "SearchCustom",
  props: [
      'tags',
      'searchContent'
  ],
  created() {},
  data() {
    return {
      isOpen: false,
      selectedTagId: 0,
      keyword: '',
    }
  },
  methods: {
    selectTag(id) {
      this.selectedTagId = id
    },
  },
};
</script>

<style scoped>
.wrapper {
  background-color: #fff;
  width: 100%;
  max-width: 600px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 8px;
  position: relative;
  z-index: 199;
}

.search__left {
  display: flex;
  align-items: center;
}

.search__input {
  height: 50px;
  border: none !important;
  padding: 10px 20px;
  border-radius: 15px !important;
  width: 350px;

  &:focus {
    box-shadow: none;
    outline: none;
  }

  &:active {
    box-shadow: none;
  }
}

.search__select {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  height: 50px;
  width: 170px;
  background-color: #FFCB09;
  color: #fff;
  border-bottom-left-radius: 8px;
  border-top-left-radius: 8px;
  cursor: pointer;
  position: relative;
}

.search__select.search__select--open .search__dropdown {
  display: block;
}

.select__name {
  margin-right: 5px;
  margin-bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.search__dropdown {
  display: none;
  padding: 0;
  position: absolute;
  list-style: none;
  background-color: #fff;
  color: #FFCB09;
  top: 120%;
  left: 0;
  width: 100%;
  border-radius: 5px;
  z-index: 1;
}

.search__image {
  margin-right: 20px;
  cursor: pointer;
}

.search__image:hover {
  transform: scale(1.1);
}


.search__option {
  padding: 5px 0 5px 45px;
}

.search__option:hover {
  background-color: #FFCB09;
  color: #fff;
}
</style>
