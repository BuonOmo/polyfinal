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


var app = new Vue({
  el: "#app",
  data: {
    finals: finals,
    courseInput: localStorage.getItem(STORAGE_PREFIX+"courseInput") || "",
    name: localStorage.getItem(STORAGE_PREFIX+"name"),
  },
  computed: {
    choice: function () {
      return this.courseInput.toUpperCase().split(/[^A-Z0-9]+/)
    },
    filteredFinals: function () {
      return this.finals.filter(final =>
        this.choice.some(str => final.id.indexOf(str) == 0) &&(!this.name || this.nameInRange(final.names))
      )
    },
    ICSurl: function () {
      return URL.createObjectURL(new File([this.exportICS()],"agenda-finaux.ics"));
    }
  },
  methods: {
    nameInRange: function(range) {
      return range == null || range[0].lastname.toUpperCase() < this.name.toUpperCase() &&
                              range[1].lastname.toUpperCase() > this.name.toUpperCase()
    },
    save: function() {
      if (this.courseInput) localStorage.setItem(STORAGE_PREFIX+"courseInput", this.courseInput);
      if (this.name) localStorage.setItem(STORAGE_PREFIX+"name", this.name);
    },
    exportICS: function() {
      var ics = new ICAL.Component(['vcalendar',[],[]]);
      this.filteredFinals.map(final => {
        var vevent = new ICAL.Component('vevent'),
            event = new ICAL.Event(vevent);
        var dtstart = moment(final.date, DATE_FORMAT);
        event.startDate = ICAL.Time.fromString(dtstart.format());
        event.endDate   = ICAL.Time.fromString(dtstart.add({hour: 3}).format());
        event.summary   = "Final de "+final.id+".";
        event.location  = "Polytechnique montréal, salle "+final.class;
        event.uid = "POLY_FINAL_"+final.id+final.section;
        vevent.addPropertyWithValue('dtstamp', ICAL.Time.now());
        ics.addSubcomponent(vevent);
      });
      return ics.toString();
    }
  }
})
