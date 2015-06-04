require('insert-css')(require('./app.css'))

var Vue = require('vue');

require('vue-resource')(Vue);

new Vue({
  el: '#app',
  // require html enabled by the partialify transform
  template: require('./app.html'),
  data: {
    sortKey: 'stars',
    reverse: true,
    search: '',
    stars: 5,
    github: 'dbpolito',
    columns: ['name', 'stars', 'watchers', 'language'],
    featured: ['firestead'],
    repos: [],
  },
  methods: {
    isFeatured: function(name) {
        var names = this.repos.map(function(repo) {
            return repo.name;
        });

        return this.featured.indexOf(name) !== -1;
    },
    sortBy: function(sortKey) {
        this.reverse = (this.sortKey == sortKey) ? ! this.reverse : false;
        this.sortKey = sortKey;
    }
  },
  filters: {
    stars: function(repos) {
        var self = this;

        return repos.filter(function(repo) {
            return repo.stars >= self.stars;
        });
    }
  },
  ready: function() {
    this.$http.get('https://api.github.com/users/' + this.github + '/repos', function (data, status, request) {
        console.log(data);
        repos = data
            .filter(function(repo) {
                return repo.fork === false;
            })
            .map(function(repo) {
                return {
                    'id': repo.id,
                    'name': repo.name,
                    'description': repo.description,
                    'stars': +repo.stargazers_count,
                    'watchers': +repo.watchers_count,
                    'language': repo.language,
                    'url': repo.html_url,
                }
            });
        this.repos = repos;
    }).error(function (data, status, request) {
        // handle error
    });
  }
})
