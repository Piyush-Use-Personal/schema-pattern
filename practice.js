function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}


class Parent {
    constructor(fields){
        if (this.constructor == Parent) {
            throw new Error("Abstract classes can't be instantiated.");
        }
        // process fields
        this.#fromFields(fields)
    }

    #checkIfPropertyExist(field, name) {
        return !!this[field].find(k => k == name)
    }

    #verification(field, payload) {
        let current = 0
        for (const [key] of Object.entries(payload)) {
            if (!this.#checkIfPropertyExist(field, key)) {
                throw new Error(`Unknown field for ${field}: ${key}`)
            }
            current += 1
        }
        if (current !== this[field].length) throw new Error('all fields are required')
        return
    }
    #saveMethodProtoType(field, payload, callback) {
        this.#verification(field, payload)
        // make API call
        callback('any value')
    }
    #getMethodProtoType(field, payload, callback) {
        this.#verification(field, payload)
        // make API call
        callback('any value')
    }
    #deleteMethodProtoType(field, payload, callback) {
        this.#verification(field, payload)
        // make API call
        callback('any value')
    }
    #updateMethodProtoType(field, payload, callback) {
        this.#verification(field, payload)
        // make API call
        callback('any value')
    }
    
    #fromFields(fields) {
        for (const [key, value] of Object.entries(fields)) {
            if (!Array.isArray(value.value)) throw new Error('value should be array of fields')
            this[key] = null
            const t = Object.defineProperty(this, key, {
                value: value.value,
                writable: !value.readOnly
            })
            this.#addMethods(key)
        }
    }
    #addMethods(key) {
        const saveMethodName = `save${toTitleCase(key)}`
        const getMethodName = `get${toTitleCase(key)}`
        const deleteMethodName = `delete${toTitleCase(key)}`
        const updateMethodName = `update${toTitleCase(key)}`
        this[saveMethodName] = null
        this[getMethodName] = null
        this[deleteMethodName] = null
        this[updateMethodName] = null
        Object.defineProperties(this, {
            [saveMethodName]: {
                value: function (payload, callback) {
                    return this.#saveMethodProtoType(key, payload, callback)
                },
                writable: false
            },
            [getMethodName]: {
                value: function (payload, callback) {
                    return this.#getMethodProtoType(key, payload, callback)
                },
                writable: false
            },
            [deleteMethodName]: {
                value: function (payload, callback) {
                    return this.#deleteMethodProtoType(key, payload, callback)
                },
                writable: false
            },
            [updateMethodName]: {
                value: function (payload, callback) {
                    return this.#updateMethodProtoType(key, payload, callback)
                },
                writable: false
            },
        })
    }

    
}

class Child extends Parent{
    constructor(fields) {
        super(fields)
    }
}

const fields = {
    company: {
        value: ['Id', 'Name', 'IsActive'],
        readOnly: false
    },
    user: {
        value: ['Id', 'Name', 'IsActive'],
        readOnly: true
    },
    email: {
        value: ['Id', 'Name', 'template'],
        readOnly: true
    },
}
try {
    const parent = new Child(fields)
    console.log('success')
} catch (error) {
    console.error(error)
}