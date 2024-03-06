export enum Uri { 

    CATEGORIES = "/categories"  , 
    CATEGORY_ITEM = "/categories/search/findByItemId" , 

    SAVE_CATEGORY = "/categories/save" , 
    DELETE_CATEGORY = "/categories/delete"  , 
    ALL_ITEMS = "/items/search/findAll" , 
    ALL_ITEMS_PAGINATED  = "/items" , 
    
    ITEMS_CATEGORY = "/items/search/findAllByCategoryId" , 
    ITEMS_CATEGORY_PAGINATED = "/items/search/findByCategoryId" , 
    
    ITMES_LIKE_PAGINATED = "/items/search/findLike" ,
    ITEMS_CATGORY_LIKE_PAGINATED="/items/search/findByCategoryIdLike" ,
    SAVE_ITEM = "/items/save"  , 
    REMOVE_ITEM= "/items/remove"  , 

    STOCKS_PAGINATED = "/stocks" , 
    STOCKS_LIKE_PAGINATED = "/stocks/search/findLike" , 
    STOCKS_CATEGORY_PAGINATED ="/stocks/search/findByItemCategory" , 
    STOCKS_CATEGORY_LIKE_PAGINATED = "/stocks/search/findByCategoryIdLike" , 
    STOCKS_TOTAL_UNITS="/stocks/search/findTotalUnits" , 
    STOCKS_TOTAL_PURCHASE_PRICE  = "/stocks/search/findTotalPurchasePrice", 
    STOCKS_TOTAL_EXP_PROFITS = "/stocks/search/findTotalExpProfits" , 
    STOCK_BUY = "/stocks/buy" , 
    STOCK_SELL = "/stocks/sell" , 
    STOCK_PERISHED = "/stocks/perished"  ,  

    SALES_BETWEEN = "/sales/search/findBySaleDateBetween" , 
    SALES_CATEGORY_BETWEEN = "/sales/search/findByCategoryIdBetween" , 
    SALES_ITEM_BETWEEN = "/sales/search/findByItemIdBetween"  , 

    SALES_TOTAL_PRICE_BETWEEN = "/sales/search/findTotalPriceBetween" , 
    SALES_TOTAL_PRICE_GBETWEEN = "/sales/search/findTotalPriceByCategoryIdBetween" , 
    SALES_TOTAL_PRICE_IBETWEEN = "/sales/search/findTotalPriceByItemIdBetween" , 
    
    SALES_AVG_PRICE_BETWEEN = "/sales/search/findAvgPriceBetween" , 
    SALES_AVG_PRICE_GBETWEEN = "/sales/search/findAvgPriceByCategoryIdBetween" , 
    SALES_AVG_PRICE_IBETWEEN = "/sales/search/findAvgPriceByItemIdBetween" , 
    

    SALES_TOTAL_QUANTITY_BETWEEN = "/sales/search/findTotalQuantityBetween" , 
    SALES_TOTAL_QUANTITY_GBETWEEN = "/sales/search/findTotalQuantityByCategoryIdBetween" , 
    SALES_TOTAL_QUANTITY_IBETWEEN = "/sales/search/findTotalQuantityByItemIdBetween" , 

    SALES_TOTAL_PROFIT_BETWEEN = "/sales/search/findTotalProfitBetween" , 
    SALES_TOTAL_PROFIT_GBETWEEN = "/sales/search/findTotalProfitByCategoryIdBetween" , 
    SALES_TOTAL_PROFIT_IBETWEEN = "/sales/search/findTotalProfitByItemIdBetween" , 

    SALES_AVG_PROFIT_BETWEEN = "/sales/search/findAvgProfitBetween" , 
    SALES_AVG_PROFIT_GBETWEEN = "/sales/search/findAvgProfitByCategoryIdBetween" , 
    SALES_AVG_PROFIT_IBETWEEN = "/sales/search/findAvgProfitByItemIdBetween" , 

    SAVE_SELL = "/sales/save" , 
    DELETE_SELL = "/sales/delete" , 



    EXPS_BETWEEN = "/expenses/search/findByDateBetween" , 
    EXPS_CATEGORY_BETWEEN = "/expenses/search/findByCategoryIdBetween" , 
    EXPS_ITEM_BETWEEN = "/expenses/search/findByItemIdBetween"  , 


    EXPENSES_TOTAL_QUANTITY_BETWEEN = "/expenses/search/findTotalQuantityBetween" , 
    EXPENSES_TOTAL_QUANTITY_GBETWEEN = "/expenses/search/findTotalQuantityByCategoryIdBetween" , 
    EXPENSES_TOTAL_QUANTITY_IBETWEEN = "/expenses/search/findTotalQuantityByItemIdBetween" , 


    EXPENSES_TOTAL_PRICE_BETWEEN = "/expenses/search/findTotalPriceBetween" , 
    EXPENSES_TOTAL_PRICE_GBETWEEN = "/expenses/search/findTotalPriceByCategoryIdBetween" , 
    EXPENSES_TOTAL_PRICE_IBETWEEN = "/expenses/search/findTotalPriceByItemIdBetween" , 

    SAVE_EXPENSE = "/expenses/save" , 
    DELETE_EXPENSE = "/expenses/delete" , 


    PERISHED_BETWEEN = "/perished/search/findByDateBetween" , 
    PERISHED_CATEGORY_BETWEEN = "/perished/search/findByCategoryIdBetween" , 
    PERISHED_ITEM_BETWEEN = "/perished/search/findByItemIdBetween"  , 


    PERISHED_TOTAL_QUANTITY_BETWEEN = "/perished/search/findTotalQuantityBetween" , 
    PERISHED_TOTAL_QUANTITY_GBETWEEN = "/perished/search/findTotalQuantityByCategoryIdBetween" , 
    PERISHED_TOTAL_QUANTITY_IBETWEEN = "/perished/search/findTotalQuantityByItemIdBetween" , 




    PERISHED_TOTAL_PRICE_BETWEEN = "/perished/search/findTotalPriceBetween" , 
    PERISHED_TOTAL_PRICE_GBETWEEN = "/perished/search/findTotalPriceByCategoryIdBetween" , 
    PERISHED_TOTAL_PRICE_IBETWEEN = "/perished/search/findTotalPriceByItemIdBetween" , 



    SAVE_PERISHED = "/perished/save" , 
    DELETE_PERISHED = "/perished/delete" , 


}