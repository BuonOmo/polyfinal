/**
 * Prefix used for localStorage, change it if you’re in dev and want to keep your saved data.
 * @type {String}
 */
const STORAGE_PREFIX="POLYFINAL_";
/**
 * Format to use to parse date from finals table with moment(string, DATE_FORMAT).
 * @type {String}
 */
const DATE_FORMAT = "D MMMM HH:mm";


Vue.filter('date', function (value) {
  return moment(value)
    .utcOffset(-5) // Force Quebec Timezone to avoid strange results
    .format('LLLL');
});

var app = new Vue({
  el: "#app",
  data: {
    finals: finals,
    courseInput: localStorage.getItem(STORAGE_PREFIX+"courseInput") || "",
    name: localStorage.getItem(STORAGE_PREFIX+"name"),
    justSaved: false,
    sortString: null,
    sortOrder: true
  },
  computed: {
    sortBy: {
      get: function() { return this.sortBy; },
      set: function(string) { this.sortOrder = this.sortString !== string || !this.sortOrder;
                              this.sortString = string; }
    },
    choice: function () {
      return this.courseInput.toUpperCase().split(/[^A-Z0-9]+/)
    },
    filteredFinals: function () {
      return this.finals.filter(final =>
        this.choice.some(str => final.id.indexOf(str) == 0) &&(!this.name || this.nameInRange(final))
      )
    },
    orderedFilterdFinals: function () {
      if (!this.sortString)
        return this.filteredFinals;
      return this.filteredFinals.sort((a,b) => {
        if (a[this.sortString] < b[this.sortString]) {
          return this.sortOrder ? -1 : 1;
        } else if (a[this.sortString] > b[this.sortString]) {
          return this.sortOrder ? 1 : -1;
        } else {
          return 0;
        }
      })
    },
    ICSurl: function () {
      return URL.createObjectURL(new File([this.exportICS()],"agenda-finaux.ics"));
    }
  },
  methods: {
    nameInRange: function(final) {
      /*
      First check is there is a room split, then check for name not to exceed lower nor upper bound
       */
      return !(final.upperBound || final.lowerBound) ||
             (final.upperBound && final.upperBound.lastname.toUpperCase() > this.name.toUpperCase()) ||
             (final.lowerBound && final.lowerBound.lastname.toUpperCase() < this.name.toUpperCase())
    },
    save: function() {
      if (this.courseInput) localStorage.setItem(STORAGE_PREFIX+"courseInput", this.courseInput);
      if (this.name) localStorage.setItem(STORAGE_PREFIX+"name", this.name);
      this.justSaved = true;
      setTimeout(() => this.justSaved = false, 6000)
    },
    exportICS: function() {
      var ics = new ICAL.Component(['vcalendar',[],[]]);
      this.filteredFinals.forEach(final => {
        var vevent = new ICAL.Component('vevent'),
            event = new ICAL.Event(vevent);
        var date = new Date(final.date);
        event.startDate = ICAL.Time.fromString(date.toISOString());
        date.setHours(date.getHours() + 3)
        event.endDate   = ICAL.Time.fromString(date.toISOString());
        event.summary   = "Final de "+final.id+".";
        event.location  = "Polytechnique montréal, salle "+final.class;
        event.uid = "POLY_FINAL_"+final.id+final.section;
        vevent.addPropertyWithValue('dtstamp', ICAL.Time.now());
        ics.addSubcomponent(vevent);
      });
      return ics.toString();
    }
  }
});
