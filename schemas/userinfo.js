var mongoose = require("mongoose");

var UserData = mongoose.Schema({
  fbId: String,
  firstName: String,
  LastName: String,
  profilePic: String,
  locale: String,
  timeZone: String,
  gender: String,
  sessionStart: {
    type: Date,
    default: Date.now
  },
  sessionEnd: {
    type: Date,
    default: Date.now
  },
  optionsSelected: [],
  modules: [],
  urlsVisited: [],
  location: {
    type: {
      type: String
    },
    coordinates: [Number]
  },
  locationURL: String,
  messageNumber: {
    type: Number,
    default: 0
  },
  eventSearchSelected: [],
  showMemore: {
    index1: {
      type: Number,
      default: 0
    },
    index2: {
      type: Number,
      default: 0
    },
    index3: {
      type: Number,
      default: 0
    }
  },
  context: String,
  mlinkSelected: String,
  categorySearchSelected: [],
  querysTevo: [],
  queryTevoFinal: String,
  queryTevoReplace: String,
  page: {
    type: Number,
    default: 0
  },
  per_page: {
    type: Number,
    default: 0
  },
  artists: [],
  musical_genres: [],
  teams: [],
  cities: [],
  event_type: [],

  userSays: [{
    typed: String,
    writtenAt: {
      type: Date,
      default: Date.now
    }
  }],
  messageTitle: String,

  coordinates: {
    lat: {
      type: Number,
      default: 0
    },
    lon: {
      type: Number,
      default: 0
    }
  },

  zomatoQs: {},

  searchTevoParameters: {
    q: {
      type: String,
      default: ""
    },
    city: {
      type: String,
      default: ""
    },
    lat: {
      type: Number,
      default: 0
    },
    lon: {
      type: Number,
      default: 0
    },
    occurs_at_gte: {
      type: Date,
      default: Date.now
    },
    occurs_at_lte: {
      type: Date,
      default: Date.now
    },
    page: {
      type: Number,
      default: 1
    },
    per_page: {
      type: Number,
      default: 9
    }
  },
  artistsSelected: [

  ],


  spotify_id: String,
  artistHasEvent: {
    type: Boolean,
    default: false
  },
  notifications_activated: {
    type: Boolean,
    default: true
  },

  events_clicked: [],
  categories: [],
  performances: []

});

module.exports = mongoose.model("UserData", UserData);














/*var mongoose = require('mongoose');

var UserData = mongoose.Schema({

	fbId: String,
	firstName: String,
	LastName: String,
	profilePic: String,
	locale: String,
	timeZone: String,
	gender: String,
	sessionStart: {
		type: Date,
		default: Date.now
	},
	sessionEnd: {
		type: Date,
		default: Date.now
	},
	optionsSelected: [],
	modules: [],
	urlsVisited: [],
	location: {
		type: {
			type: String
		},
		coordinates: [Number]
	},
	locationURL: String,
	messageNumber: {
		type: Number,
		default: 0
	},
	eventSearchSelected: [],
	showMemore: {
		index1: {
			type: Number,
			default: 0
		},
		index2: {
			type: Number,
			default: 0
		},
		index3: {
			type: Number,
			default: 0
		}
	},
	context: String,
	mlinkSelected: String,
	categorySearchSelected: [],
	querysTevo: [],
	queryTevoFinal: String,
	queryTevoReplace: String,
	page: {
		type: Number,
		default: 0
	},
	per_page: {
		type: Number,
		default: 0
	},
	artists: [],
	musical_genres: [],
	teams: [],
	cities: [],
	event_type: [],

	userSays: [{
		typed: String,
		writtenAt: {
			type: Date,
			default: Date.now
		}
	}],
	messageTitle: String,

	coordinates: {
		lat: {
			type: Number,
			default: 0
		},
		lon: {
			type: Number,
			default: 0
		}
	},

	zomatoQs: {},

	searchTevoParameters: {
		q:{
			type: String,
			default: ''
		},
		city: {
			type: String,
			default: ''
		},
		lat: {
			type: Number,
			default: 0
		},
		lon: {
			type: Number,
			default: 0
		},
		occurs_at_gte:{
			type: Date,
			default: Date.now
		},
		occurs_at_lte:{
			type: Date,
			default: Date.now
		},
		page:{
			type: Number,
			default: 1
		},
		per_page:{
			type: Number,
			default: 9
		}

	},


});

module.exports = mongoose.model('UserData', UserData);*/