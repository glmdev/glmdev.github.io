const get_env_with_default = (env_key, default_value) => {
    if ( env_key in process.env ){
        return process.env[env_key]
    }
    
    return default_value
}

const config = {
    db: {
        host: get_env_with_default('MONGO_HOST', 'localhost'),
        name: get_env_with_default('MONGO_DB', 'glmdev'),
    },
    http: {
        session_key: get_env_with_default('SESSION_KEY', 'CHANGEME'),
        port: get_env_with_default('HTTP_PORT', 8080),
    },
}

module.exports = config