#DonationPopup

The script will genereate a bootstrap modal when the user clicks the checkout button that allows the customer to make a donation or continue with their purchase.

##Installation

- Update the OPC layout with the changes in onepagecheckout.html. These changes should be placed at the bottom of the OPC layout.
- Upload donation.js to `##THEMEDIR##js/donation.js`.
- Add the styles in style.css to the Global Stylesheet under the OPC section.


##Configure

The changes to OPC include a script that taks 5 configurable options.


```
window.page = new DonationPage({
  storeName : '##STORENAME##',
  amts : "25.00|50.00|75.00|100.00|other",
  labels : "$25.00 (Twenty-five dollars)|$50.00 (Fifty dollars)|$75.00 (Seventy-five dollars)|$100.00 (One hundred dollars)|or choose another amount",
  description : "<div>Thank you so much for your purchase.  Please consider making a tax deductible donation today to directly support ACLU's mission to defend and preserve the individual rights and liberties guaranteed by the Constitution.</div><br/><div>Please choose one of the following tax deductible donations. If you would like to donate a different amount, choose 'Other' from the list below.</div>",
  btnText : 'Continue'
});
```


`storeName` - Default code uses `##STORENAME##` to by dynamic. Used in the donation name.

`amts` - Pipe-separated list of available amounts. Should not include special characters like $. Must be a number or the special keyword `other` which binds to a free-form textbox

`labels` - Pipe-separated list of labels for each of the amounts above. Must be the same number of entries as amounts.

`description` - Text that goes above the donation amounts in the popup. HTML can be used here.

`btnText`- The text of the place order button on page load before the popup has been triggered.