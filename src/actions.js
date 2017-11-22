export const UPDATE = '@view-state/update';
export const DELETE = '@view-state/delete';

export const updateViewState = (id, st) => ({
  type: UPDATE,
  meta: { id },
  payload: st
});

export const deleteViewState = id => ({
  type: DELETE,
  meta: { id }
});
