import { Action, createSelector, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import { User } from '@acme/shared-models';
import { ApiService } from '../../services/api.service';
import { LoadUsers } from './users.actions';
import { Injectable } from '@angular/core';

interface UsersMapStateModel {
    [userId: string]: User;
}

interface UsersStateModel {
    usersMap: UsersMapStateModel;
    loadingUsers: boolean;
}

@State<UsersStateModel>({
    name: 'UsersState',
    defaults: {
        usersMap: {},
        loadingUsers: false,
    },
})
@Injectable()
export class UsersState implements NgxsOnInit {

    @Selector()
    static usersMap(state: UsersStateModel) {
        return state.usersMap;
    }

    @Selector()
    static usersList(state: UsersStateModel) {
        return Object.values(state.usersMap);
    }

    static user(userId: number) {
        return createSelector(
            [UsersState.usersMap],
            (ticketsMap: UsersMapStateModel) => {
                return ticketsMap[userId];
            });
    }

    @Selector()
    static usersLoading(state: UsersStateModel) {
        return state.loadingUsers;
    }

    constructor(public api: ApiService) {
    }

    ngxsOnInit(ctx?: StateContext<UsersStateModel>) {
        ctx?.dispatch(new LoadUsers());
    }

    @Action(LoadUsers)
    public loadUsers(ctx: StateContext<UsersStateModel>) {
        ctx.patchState({ loadingUsers: true });
        this.api.users().subscribe((users) => {
            ctx.patchState({
                loadingUsers: false,
                usersMap: usersListToUsersMap(users),
            });
        });
    }
}

function usersListToUsersMap(users: User[]): UsersMapStateModel {
    return users.reduce((acc, it) => {
        acc[it.id] = it;
        return acc;
    }, {} as UsersMapStateModel);
}
