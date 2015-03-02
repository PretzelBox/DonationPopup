var Donation = function(){
  this.amount = -1;
  this.label = "";
  this.type =  Donation.types.FIXED;
  this.$el = null;
  
  this.init();
};

Donation.types = {
  FIXED : 0,
  VARIABLE : 1
};

Donation.prototype = {
  init : function(){},
  render : function(index){
    this.$el = $('<li><input type="radio" name="rdDonationAmount"/></li>');
    
    this.$el.find('input').attr('value',this.amount).after($('<span class="amountLabel"></span>').text(this.label));
    
    if(this.type === Donation.types.VARIABLE)
      this.$el.find('.amountLabel').after($('<input type="text" name="txtOtherDonationAmount" class="variable-donation-amount"/>'));
    
    this.$el.find('input[type=radio]').data('AC:DonationIndex', index);
    
    return this.$el;
  },
  getValue : function(){
    if(this.$el === null)
      return null;
    
    var value = null;
    switch(this.type){
      case Donation.types.FIXED :
        value = this.$el.find('input[type=radio]').val();
        break;
      case Donation.types.VARIABLE :
        value = this.$el.find('input[type=text]').val();
        break            
    };
    
    if(value == null || value == undefined || value == 0)
      value = null;
    
    return value;
  }
};

var DonationPage = function(settings){
  this.donations = [];
  this.$el = null;
  this.$modal = $('#donation-modal');
  
  this.storeName = settings.storeName;
  this.description = settings.description;
  this.btnText = settings.btnText;
  
  this.$placeOrderBtn = $('#btnPlaceOrder');
  this.init(settings);
}
DonationPage.Events = {
  DONATIONCOMPLETE : 'AC:DonationComplete'
};
DonationPage.prototype = {
  init : function(settings){
    
    var amounts = settings.amts.split('|'),
        labels = settings.labels.split('|');
    
    if(!Array.isArray(amounts) || !Array.isArray(labels) || amounts.length !== labels.length)
      throw new TypeError('The amounts and labels for the amounts should be a pipe-separated list of values and must contains the same number of entries.');
    
    for(var i=0; i<amounts.length; i++){
      var d = new Donation();
      
      d.amount = amounts[i];
      d.label = labels[i];
      
      if(d.amount.toLowerCase() === 'other')
        d.type = Donation.types.VARIABLE;
      
      this.donations.push(d);
    }
    
    var self = this;
    this.$modal.find('#donation-decline').click(function(){
      self.onDecline();
    });
    this.$modal.find('#donation-accept').click(function(){
      self.onAccept();
    });
    this.$modal.on(DonationPage.Events.DONATIONCOMPLETE, function(){
      self.onComplete();
    });
    
    this.$placeOrderBtn.wrap('<div class="default-place-order-button" style="display:none;"></div>');
    this.$placeOrderBtn.parent().after('<input type="button" class="ThemeButton btn btn-primary DonationButton" value="' + this.btnText + '">');
    
    $(".DonationButton").data(DonationPage.Events.DONATIONCOMPLETE, false).click(function(event){
      if( !$(this).data(DonationPage.Events.DONATIONCOMPLETE) ){
        event.preventDefault();
        self.show();
      }
    });
    
    AC.init({storeDomain : AC.sslDomain});
  },
  render : function(){
    this.$el = $(document.createElement('div'));
    
    this.$el.append( $('<ul class="donations-area"></ul>') );
    
    for(var i=0; i<this.donations.length; i++)
      this.$el.find('.donations-area').append(this.donations[i].render(i));
    
    this.$el.prepend( $(this.description) );
    
    return this.$el;
  },
  show : function(){
    this.$modal.find('.modal-body').html(this.render());
    this.$modal.modal('show');
  },
  getAmount : function(){
    var donationIndex = this.$el.find('input[name=rdDonationAmount]:checked').data('AC:DonationIndex');
    
    if(donationIndex === null)
      return null;
    else
      return this.donations[donationIndex].getValue();
  },
  addDonationItem : function(){
    var amt = this.getAmount().replace('$', ''),
        err = false;
    
    try { amt = parseFloat(amt); }
    catch(e) { err = true; }
    
    if(amt === null || amt === undefined || err || isNaN(amt)){
      if(!this.confirmContinue(donationItem.price)) 
        this.onDecline();
      else
        return;
    }
    
    var donationItem = {
      itemId : -1,
      itemName : this.storeName + " Donation - $" + amt,
      quantity : 1
    };
    
    donationItem.price = amt;
    donationItem.itemNr = 'donation' + '-' + donationItem.price;
    donationItem.itemNumber = 'donation' + '-' + donationItem.price;
    
    var self = this;
    
    AC.cart.add(donationItem, function(){
      self.$modal.trigger(DonationPage.Events.DONATIONCOMPLETE);
    });
    
  },
  confirmContinue : function(amount){
    return confirm('The value entered is invalid. Press OK to continue without adding a donation. Press Cancel to re-enter your donation amount.');
  },
  onDecline : function(){
    this.$modal.modal('hide');
    this.$modal.trigger(DonationPage.Events.DONATIONCOMPLETE);
  },
  onAccept : function(){
    this.addDonationItem();
    this.$modal.modal('hide');
  },
  onComplete : function(){
    parent.window.__doPostBack('UpdatePanelCartArea', '');
    $(".default-place-order-button").show();
    $(".DonationButton").attr('value', 'Place Order').data(DonationPage.Events.DONATIONCOMPLETE, true).hide();
  }
};