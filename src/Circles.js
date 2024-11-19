export class RGCircle{
constructor(
    position,
    unit,
    powergain,
    shieldgain
){
    this.position = position
    this.unit = unit
    this.powergain = powergain
    this.shieldgain = shieldgain
}

}
export class VGCircle{
    constructor(
        unit,
        powergain
    ){
        this.unit = unit
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