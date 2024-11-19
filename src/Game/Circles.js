export class RGCircle{
constructor(
    position,
    rearguard,
    powergain,
    shieldgain
){
    this.position = position
    this.rearguard = rearguard
    this.powergain = powergain
    this.shieldgain = shieldgain
}

}
export class VGCircle{
    constructor(
        vanguard,
        powergain
    ){
        this.vanguard = vanguard
        this.powergain = powergain
    }
    
}
export class GCircle{
    constructor(
        guardians
    ){
        this.guardians = guardians
    }
    
}
class Unit{
    constructor(
        name,
        grade,
        text,
        skill ,
        originalPower,
        originalCritical,
        originalShield,
        img,
        nation,
        clan,
        race,
        set,
        setNo,
        cardtype,
        flavor,
        format,
        sleeve,
        triggereffect,
        state,
        abilityActive,
        tempPower,
        tempCritical,
        tempShield,
        isVanguard
    ){}
        Attack(AttackingUnit, DefendingUnit){}
        Boost(AttackingUnit, BoostingUnit){}
        Intercept(InterceptingUnit , GCircle){}
}