


const restorePurchases = async () => {
    const purchaseInfo = await Purchases.restorePurchases()

    if(purchaseInfo.activeSubscriptions.length > 0){
       Alert.alert("Success", "Your purchase has been restored")
    }else{
       Alert.alert("Subscription Error", "You don't have purchases to restore")
    }
 }