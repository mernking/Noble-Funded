# Noble-Funded

what is left to be done in the project is to update the api and link it with 
   the current frontend system that has been built.                             
                                                                                
   read @Noble_Funded_Technical_Requirements.md so you have proper clearity of  
   the project information and scop, i made some changes while i was            
   developing, so i used fastify for the backend file based routing.            
   i used postgress db and superbase for both user auth and admin auth with     
   google auth.                                                                 
   @admin/app/routes/login.jsx and @frontend/app/routes/login.jsx you will see  
   both systems their and how it connected to the api @admin/app/lib/api.js     
   @frontend/app/lib/api.js and use auth system fully for the api calles and in 
   the admin you will notice in the layout @admin/app/routes/layout.jsx it has  
   a role based acess.  



 what i need you to do with the information above is to make api.js/api.ts    
   utilify file in the noble-funded-checkout super-admin-dasboard           
   dashboard.noblefunded becuase they are the updated code base for the       
   frontend and it looks nice, all you need to do is to plug it with the        
   backend backend the checkout will be using flutterwave, and remember the   
   checkout is standing alone, the dashboard is standing alone, so keep a       
   system in place that will keep track so that when traders purchase a         
   challend it will be added to their own account and not just waste their      
   money.                                                                       
                                                                                
   for api's required by noble-funded-checkout noble-funded-checkout       
   super-admin-dasboard make them in backend and make sure it follows the     
   system in place api/version/normalNAme if it admin                           
   api/version/admin/normalName current is dev if you read the                  
   @admin/app/lib/api.js and @frontend/app/lib/api.js you will see the why the  
   system allow for api version controle easily. and the three frontend where   
   you will be working some have demo data and interface so you can use their   
   structure to update @backend/db/schema.js so it remains consistent and CRUD  
   system accurately without error                                              
▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄