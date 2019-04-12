var db = require('../db');
var Address = require('./Address');
var Account = require('./Account');


var Artisan = {

    createArtisan : function(Artisan,callback){
        
        Account.createAccount(Artisan.account,(err,res) => {
            if(err){
                callback(err,null);
            }else{
                Address.createAddress(Artisan.address,(err,addressId)=>{
                    if(err){
                        callback(err,null);
                    }else{
                        var query = "INSERT INTO `artisan` "+
                            "(`idArtisant`, `dob`, `firstname`, `lastname`, `phone`, `picture`,"+
                            "`picture_status`, `sexe`, `role`, `idAccount`, `idAddress`) "+
                            "VALUES (NULL, ?, ?, ?, ?, NULL, 0, ?, '0', ?, ?);";
                        db.query(query,[Artisan.dob,Artisan.firstname,Artisan.lastname,Artisan.phone,Artisan.sexe,res.id,addressId],
                            (err,rows)=>{
                                if(err) callback(err,null);
                                else {
                                    callback(null,res.token);
                                }
                            });
                    }
                });      
            }
        });     
    },
    isUserExist : function(Artisan,callback){
        db.query("Select * FROM Artisan where email = ?",[Artisan.email],callback);
    },
    updatePassword : function(Artisan,callback){
        db.query("update artisan set pwd = ? where id = ?",[Artisan.pwd,Artisan.id],callback);
    },
    getEmailConfirmationCode : function(Artisan,callback){
        return db.query("Select * from artisan where confirmation_token = ?",[Artisan.confirmation_token],callback);
    },
    setEmailValid : function(Artisan,callback){
        db.query("update artisan set status = 0,confirmation_token='' where confirmation_token=?",
            [Artisan.confirmation_token],
            callback);
    },
    getArtisan: function(Artisan,callback){
        db.query("Select * FROM Artisan,account where artisan.idAccount= account.idAccount and account.status not in (-1)",[],callback);
    },   
    getOneArtisan: function(Artisan,callback){
        db.query("Select * FROM Artisan,Account,Address where artisan.idAccount= account.idAccount and artisan.idArtisant=? and artisan.idAddress=Address.idAddress",[Artisan.id],callback);
    },
    login : function(Artisan,callback){
        db.query("Select * from account,artisan where account.email = ? && account.idAccount = artisan.idAccount",
        [Artisan.email],function(err,fields){
            if(err){
                callback(err,null);
            }else{
                if(fields.length > 0){
                    var pass = Account.decryptPassword(fields[0].pwd);
                    var res = {};
                    if(pass === Artisan.pwd && fields[0].status == 1){
                        res = {
                            status : true,
                            rows : fields
                        }
                    }else{
                        res = {
                            status : false,
                            rows : null
                        }
                    }
                }
                callback(null,res);
            }
        });
    },
    artisanVerified : function(Artisan, callback){
        db.query("update account,artisan set verified=1 where email=? && account.idAccount = artisan.idAccount", Artisan.email, callback);
    },
    findArtisants : function(Artisant,callback){
        db.query("select a.*, se.* from service_artisant se, artisan a,service s, metier m, address dr" +
        " where se.idArtisant = a.idArtisant AND "+
                " se.idService = s.idService AND "+
                " s.idMetier=m.idMetier AND "+
                " a.idAddress=dr.idAddress ", 
                [Artisant.idMetier,Artisant.idService,Artisant.idAddress],callback);
    },
    
    getArtisanInserted : function(Artisan,callback){
        db.query("Select * from Account WHERE created_date > ?", [Artisan.date], callback);
    },   
        //******************************************* */
    getOneArtisanById: function (idArtisan, callback) {
        db.query("Select * FROM artisan,account,address where artisan.idAccount= account.idAccount and artisan.idArtisant=? and artisan.idAddress=Address.idAddress  ", [idArtisan], callback);
    },
    getArtisanById: function (Artisan, callback) {
        db.query("SELECT * FROM artisan WHERE idArtisant = ?", [Artisan.idArtisant], function (error, results, fields) {
            if (error) throw error;
            callback(results[0]);
        });
    },

    updateInfos: function (Artisan, callback) {
        this.getArtisanById(Artisan, function (artisan) {
            console.log(artisan);
            console.log(Artisan);
            Artisan = {
                idArtisant: Artisan.idArtisant,
                dob: (Artisan.dob != null ? new Date(Artisan.dob).toISOString().slice(0, 19).replace('T', ' ') : new Date(artisan.dob).toISOString().slice(0, 19).replace('T', ' ')),
                firstname: (Artisan.firstname != null ? Artisan.firstname : artisan.firstname),
                lastname: (Artisan.lastname != null ? Artisan.lastname : artisan.lastname),
                phone: (Artisan.phone != null ? Artisan.phone : artisan.phone),
                picture: (Artisan.picture != null ? Artisan.picture : artisan.picture),
                picture_status: (Artisan.picture_status != null ? Artisan.picture_status : artisan.picture_status),
                sexe: (Artisan.sexe != null ? Artisan.sexe : artisan.sexe),
                idAccount: (Artisan.idAccount != null ? Artisan.idAccount : artisan.idAccount),
                idAddress: (Artisan.idAddress != null ? Artisan.idAddress : artisan.idAddress),
                city: (Artisan.city != null ? Artisan.city : artisan.city),
                commun: (Artisan.commun != null ? Artisan.commun : artisan.commun),
                state: (Artisan.state != null ? Artisan.state : artisan.state),
                zipcode: (Artisan.zipcode != null ? Artisan.zipcode : artisan.zipcode),
                street: (Artisan.street != null ? Artisan.street : artisan.street),
                description: (Artisan.description != null ? Artisan.description : artisan.description)
            };
            db.query("UPDATE artisan,address ad set dob=?,firstname=?,lastname=?,phone=?,picture=?,picture_status=?,sexe=?,description=?,ad.city=?,ad.commun=?,ad.state=?,ad.street=?,ad.zipcode=?  WHERE Artisan.idArtisant = ? AND ad.idAddress=artisan.idAddress",
                [Artisan.dob, Artisan.firstname, Artisan.lastname, Artisan.phone, Artisan.picture, Artisan.picture_status, Artisan.sexe, Artisan.description, Artisan.city, Artisan.commun, Artisan.state, Artisan.street, Artisan.zipcode, Artisan.idArtisant],
                callback);
        });
    },
    deleteInfos: function (field, id, callback) {
        db.query("update artisan set " + field + "=null where idArtisant=?", id, callback);
    },
    getProjectsNbr: function (ArtisanId, callback) {
        db.query("SELECT COUNT(idprojet) as `ProjectsNbr` FROM projet,`artisan` WHERE projet.idArtisan = artisan.`idArtisant` AND artisan.idArtisant=?;", ArtisanId, callback);
    },
    //************************************************* getArtisansNbr */
    getArtisansNbr: function (callback) {
        db.query("SELECT COUNT(idArtisant) as 'ArtisansNbr' FROM artisan", callback);
    },
    getFeedBacks: function (ArtisanId, callback) {
        db.query("SELECT feedback.*,client.firstname AS CFirstName, client.lastname AS CLastName FROM artisan,client,feedback WHERE artisan.idArtisant=feedback.idArtisan AND client.idClient = feedback.idClient AND artisan.idArtisant=?;", ArtisanId, callback);
    },
    addClientFeedBack(ArtisanId, FeedBack, callback) {
        db.query("INSERT INTO feedback(note,review,idClient,idArtisan) VALUES(?,?,?,?);", [FeedBack.note, FeedBack.review, FeedBack.idClient, ArtisanId], callback);
    },
    addArtisanReview(ArtisanId, ClientID, rating, callback) {
        db.query("UPDATE feedback SET note = ? WHERE idClient = ? AND idArtisan = ?;", [rating, ClientID, ArtisanId], callback);
    },
    getReviewArtisanByClient(ArtisanId, ClientID, callback) {
        db.query("SELECT note FROM feedback WHERE idClient = ? AND idArtisan = ?;", [ClientID, ArtisanId], callback);
    },
    /*Proumouvoir un artisan à un artisan réferent (By Med Soussi le 23/02/2019)*/ 
    promoteArtisan: function (Artisan,callback) {
        db.query("update artisan set role = 1 where idArtisant = ?", [Artisan.idArtisant],callback);
    },

    /*Rétrograder un artisan réferent à un artisan ordinaire (By Med Soussi le 23/02/2019)*/
    demoteArtisan:  function (Artisan,callback) {
        db.query("update artisan set role = 0 where idArtisant = ?", [Artisan.idArtisant],callback);
    },
    /*** Add services for artisan in service_artisan */
    addServiceMetier: function(Artisan, callback){
        db.query("insert into service_artisant(idArtisant, idService) values(?,?)", [Artisan.idArtisant, Artisan.idService], callback);
    },
    /*** get services metiers for artisan  */
    getServiceMetier: function(idArtisant, callback){
        db.query("SELECT s.name_service,m.nameMetier FROM service_artisant sa, service s, metier m WHERE sa.idService = s.idService and s.idMetier = m.idMetier and sa.idArtisant = ?", idArtisant, callback);
    },
        /*** get artisan projects   */
    getArtisanProjects(idArtisan, callback) {
        db.query("SELECT projet.title,projet.description,image.path FROM projet,artisan,image WHERE projet.idArtisan=artisan.idArtisant AND image.idProjet=projet.idProjet AND artisan.idArtisant =?;", [idArtisan], callback);
    }
}

module.exports = Artisan;