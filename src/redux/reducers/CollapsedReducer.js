// reducer 纯函数 有两个参数 prevState 和 action

export const CollapsedReducer = (prevState={
    isCollapsed: false
}, action) => {

    let {type} = action
    switch(type){
        case 'change_collapsed':
            let newstate = {...prevState}
            newstate.isCollapsed = !newstate.isCollapsed
            return newstate
        default:
            return prevState
    }
}