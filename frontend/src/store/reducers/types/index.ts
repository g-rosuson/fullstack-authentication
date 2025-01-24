// Generic Reducer type
type Reducer<ActionType extends string, Payload, State> = {
    type: ActionType;
    // eslint-disable-next-line no-unused-vars
    action: (payload: Payload, state: State) => State;
};


export type {
    Reducer
}