function mapId(object, isArray) {
    if (isArray) {
        return object.map((instance) => {
            const toJSONMethod = instance.toJSON && typeof instance.toJSON === 'function';
            const { _id, ...partialObject } = toJSONMethod ? instance.toJSON() : instance;
            let newInstance = { id: _id, ...partialObject };
            return newInstance;
        });
    }
    else {
        const toJSONMethod = object.toJSON && typeof object.toJSON === 'function';
        const { _id, ...partialObject } = toJSONMethod ? object.toJSON() : object;
        let newObject = { id: _id, ...partialObject };
        return newObject;
    }
}


module.exports = {
    mapId
};