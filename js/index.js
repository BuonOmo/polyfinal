var storagePrefix="POLYFINAL_"
var app = new Vue({
  el: "#app",
  data: {
    finals: finals,
    courseInput: localStorage.getItem(storagePrefix+"courseInput") || "",
    name: localStorage.getItem(storagePrefix+"name"),
  },
  computed: {
    choice: function () {
      return this.courseInput.toUpperCase().split(/[^A-Z0-9]+/)
    },
    filteredFinals: function () {
      return this.finals.filter(final =>
        this.choice.some(str => final.id.indexOf(str) == 0) &&(!this.name || this.nameInRange(final.names))
      )
    }
  },
  methods: {
    nameInRange: function(range) {
      return range == null || range[0].lastname.toUpperCase() < this.name.toUpperCase() &&
                              range[1].lastname.toUpperCase() > this.name.toUpperCase()
    },
    save: function() {
      if (this.courseInput) localStorage.setItem(storagePrefix+"courseInput", this.courseInput);
      if (this.name) localStorage.setItem(storagePrefix+"name", this.name);
    }
  }
})
