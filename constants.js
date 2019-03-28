//exports.DHIS_URL_BASE = "https://uphmis.in/uphmis";
exports.DHIS_URL_BASE = "https://devtest.hispindia.org/upupgrade";
exports.username = "admin";
exports.password = "";

exports.program_doc_diary = "Bv3DaiOd5Ai";
exports.root_ou = "v8EzhiynNtf";
exports.attr_user = "fXG73s6W4ER";


exports.views = {
    login : "login",
    calendar : "calendar",
    entry : "entry",
    loading : "loader",
    settings: "settings",
    profile: "profile",
    changePassword : "changePassword"
};


exports.cache_curr_user = "dd_current_user";
exports.cache_user_prefix = "dd_user_";
exports.cache_program_metadata = "dd_program_metadata";

exports.approval_status_de = "OZUfNtngt0T";
exports.approvalCMO_OUgroups = ["xfYm6TOHh99","UBuxUMmdz1U"];

exports.approval_status = {
    approved : "Approved",
    autoapproved : "Auto-Approved",
    rejected : "Rejected",
    resubmitted : "Re-submitted",
    pendingCMO : "Pending2",
    pendingMOIC : "Pending1"    
}

exports.approval_levels = {
    moic : "approval1stlevel",
    cmo : "approval2ndlevel"
}

exports.disabled_fields = [
    'OZUfNtngt0T',
    'CCNnr8s3rgE'
];

exports.required_fields = [
    'x2uDVEGfY4K'
]


exports.disabled_fields_attr = [
    'qXQxtcuPO5S'
];

exports.hidden_fields_attr = [
    'fXG73s6W4ER'
];


























exports.splitToChunks = function(array, parts) {
    let result = [[]];
    parts = parts -1;

    for (let i = 0,j=0,k=0; i < array.length; i++) {
        result[j][k] = array[i];
        if (k%parts == 0 && k!=0 && i< array.length-1){
            j=j+1;
            result[j] = [];
            k=-1;
        }
        k=k+1;
    }
    return result;
}






exports.images ={

    offline : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAACnSURBVGhD7dVRCsIwEEXRbMnd+KsbceOKZiQPpDSiRph5cA8MbfqTGwi0AQAA7DqMp6Vzn1ufy3NlRvH3MVaH2MbHxNriOs3i43t5xGchPgvxWdLi//EjSYuPX/nqRqnxqxumxce1Wd04LV5WAtLj5ZeQMvHyTVC5ePkkrGy8vAssHy+zUIt42TvE65SOl9khLOJlewireDn1uY6Jd0vHMQAAAD5aewDJxrdHIKWqkwAAAABJRU5ErkJggg==",

    sent : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAE+SURBVGhD7dbLSgMxFIDhWXutVheCSJ+jCIHJNAk4+H5FJWmHbnwLb0ipl407F30UPalzFra1t5HJCZwPspkJnf/Q0kzCGGOMMcZoyrv5lrSqEFa3ykvx+InXd9LpL+nUOKohfsfjUuOsl52VW+iaHw8Lrvl75TaaOD6UqOM7/c42x4fA8aEsivf3ym00cfw6RGFO4f2j/x+/ydrjdaFP4MM/8SFVhqg93tyYY3gH/5h+2CZD1B7viUF+lDr9XvWhQeKR7MlmlSGCxqPJEFa9rRtBIh6pK3UI/0Svq8aQikfng4sDiHhZFkUyHgkrGqnVo7/iSMejrJvtQ9BwXiT5eOSHSJ16nomdXhTj0eSbcPppJhoX5XhkCrMH58RjlPGofX25C+fEQ5TxSNyKHTgn7qOMRz482njGGKsoSb4BVF0f66qtLbMAAAAASUVORK5CYII=",
    white:"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBw8NDRUPDw8VFRUVFRUVFRUVFRUVFRUVFRUWFhUVFRUYHSggGBolHRUVITEhJSkrLi4uFx8zODMtNygtLisBCgoKDQ0NFQ0NFSsZFR0rKy0tKysrKystKy0tLSsrNy03KystLSsrKy0tKzctKy0tKy0rLS0rKy0rLS0rKysrK//AABEIAMQBAQMBIgACEQEDEQH/xAAXAAEBAQEAAAAAAAAAAAAAAAAAAQIH/8QAJRABAAIBAgUEAwAAAAAAAAAAAAHwETGhIUGRsdECUWHhcYHB/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAH/xAAVEQEBAAAAAAAAAAAAAAAAAAAAIf/aAAwDAQACEQMRAD8A7gAgl/KiACgCXVUugHRS8kuoF4gAAAF9wFLoX3LqAACAKAhdVBLqqXQAvAFAAAAAx8icAFAAAAAAABFAAABFARQAvJFAS2FAAABLot0AAAAAAAAAMgKACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH7AAAAAAAABQAAAAAARQAAAAAAAAAAAAABAAAAAAUAAAAAAEUAQBUAAAAABRAUQBQAAAAAABAAAMgAAAAoAAACCoCoACoAAIAAACgAACgAAAAAAAAACAAAAoAAAAACKIAoAgqIAqAqKiioogigoAAAAAAACGQwFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQFRAEAAAAAAAAUAAAAAlAAAAUAAAAAAABAAAADAAAAAAAAoAAAAAACIKJkBRDIKIAoCgAAAAAIAAAAomFBBAFEBQAAEBRAFBAATKCiEAsjOVBRMqCiKoCAKIoCoAogIogCDWYBUAAELdgVC28gAJJkAygC5EMgAZBJORMHqQCJI1MAoQYUFymQFEAUIIvUALehbsCiW3mtt5AAAvEZ4e4It2S7AKs634QAL3L2QEX7RAVS9vIACALKABBOoAHqACVQBZEAWDwAI15QBYu5F2AQi7F2+wFW/wu+ABrACo/9k=",

    paper : ""
    
}


