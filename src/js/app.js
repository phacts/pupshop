App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    // Load pets.
    $.getJSON('../pets.json', function(data) {
      var petsRow = $('#petsRow');
      var petTemplate = $('#petTemplate');

      for (i = 0; i < data.length; i ++) {
        petTemplate.find('.panel-title').text(data[i].name);
        petTemplate.find('img').attr('src', data[i].picture);
        petTemplate.find('.pet-breed').text(data[i].breed);
        petTemplate.find('.pet-age').text(data[i].age);
        petTemplate.find('.pet-location').text(data[i].location);
        petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

        petsRow.append(petTemplate.html());
      }
    });

    return App.initWeb3();
  },

  initWeb3: function() {
    // Generic block to check for web3
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    }
    else {
      // No instance, fall back to Ganache (for dev purposes only)
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {
    // Load the ABI, pretty much boiler plate for truffle
    $.getJSON('Adoption.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var AdoptionArtifact = data;
      App.contracts.Adoption = TruffleContract(AdoptionArtifact);

      // Set the provider for our contract
      App.contracts.Adoption.setProvider(App.web3Provider);

      // Use our contract to retrieve and mark the adopted pets
      return App.markAdopted();
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
  },

  markAdopted: function(adopters, account) {
    var adoptionInstance;

    console.log(adopters, 'these are adopters at start of mark adopted');

    App.contracts.Adoption.deployed().then(function(instance) {
      adoptionInstance = instance; // set our instance to a variable scoped outside of this callback
      return adoptionInstance.getAdopters.call(); // read data for FREE
    }).then(function(adopters) {
      console.log(adopters, 'these are adopters in callback after adopters instance returned');
      // we have our adopters, let's loop over them and mark each adopted pet
      for (i = 0; i < adopters.length; i++) {
        if (adopters[i] !== '0x0000000000000000000000000000000000000000') { // check to see if we are NOT an empty address
          $('.panel-pet').eq(i).find('button').text('Success').attr('disabled', true).removeClass('btn-info').removeClass('btn-default').addClass('btn-success');
        }
      }
    }).catch(function(err) {
      console.log("error message", err.message);
    });
  },

  handleAdopt: function(event) {
    event.preventDefault();

    var petId = parseInt($(event.target).data('id')),
        adoptionInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log('error in getAccounts', error);
      }

      var account = accounts[0];

      App.contracts.Adoption.deployed().then(function(instance) {
        adoptionInstance = instance;
        
        // Eager update to show something in the UI letting us know adoption is underway.
        $('.panel-pet').eq(petId).find('button').text('Adopting...').attr('disabled', true).removeClass('btn-success').removeClass('btn-info').addClass('btn-default');

        // Execute adopt function as transaction from sending account
        return adoptionInstance.adopt(petId, {from: account});
      }).then(function(result) {
        console.log('result about to call mark adopted', result);
        return App.markAdopted(); // a bit inefficient, as I could just mark the one that was adopted, but this will suffice
      }).catch(function(err) {
        console.log('error message from adopt', err.message);
      });
    });
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
