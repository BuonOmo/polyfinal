var app = new Vue({
  el: "#app",
  data: {
    finals: finals,
    courseInput: ""
  },
  computed: {
    choice: function () {
      return this.courseInput.toUpperCase().split(/[^A-Z0-9]+/)
    },
    filteredFinals: function () {
      return this.finals.filter(final =>
        this.choice.some(str => final.id.indexOf(str) == 0)
      )
    }
  }
})
