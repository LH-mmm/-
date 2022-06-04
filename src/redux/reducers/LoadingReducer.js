export const LoadingReducer = (prevState={
    isSpining:false
}, action) => {
    let {type, payload} = action
    switch(type){
        case 'change_loading':
            let newstate = {...prevState}
            newstate.isSpining = payload
            return newstate
        default:
            return prevState
    }

}