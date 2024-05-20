

export const SearchListUsers = ({room, account}) => {

    return (
        <ul>
            {room.user_0 && <li className={`${room.user_0.id === account.id ? 'account-name' : ''}`}>{room.user_0.anonim_name}</li>}
            {room.user_1 && <li className={`${room.user_1.id === account.id ? 'account-name' : ''}`}>{room.user_1.anonim_name}</li>}
            {room.user_2 && <li className={`${room.user_2.id === account.id ? 'account-name' : ''}`}>{room.user_2.anonim_name}</li>}
            {room.user_3 && <li className={`${room.user_3.id === account.id ? 'account-name' : ''}`}>{room.user_3.anonim_name}</li>}
            {room.user_4 && <li className={`${room.user_4.id === account.id ? 'account-name' : ''}`}>{room.user_4.anonim_name}</li>}
        </ul>
    )
}