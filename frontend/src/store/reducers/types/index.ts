// Generic Reducer type
type Reducer<ActionType extends string, Payload, State> = {
    type: ActionType;
    action: (payload: Payload, state: State) => State;
};


export type {
    Reducer
}