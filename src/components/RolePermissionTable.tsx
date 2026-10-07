import React from 'react';
import { UserRole } from '../types/blockchain';
import { Shield, Check, X, Info } from 'lucide-react';

interface Props {
  currentRole?: UserRole;
  onSelectRole?: (role: UserRole) => void;
}

export const RolePermissionTable: React.FC<Props> = ({ currentRole = UserRole.AUTHORITY, onSelectRole }) => {
  const roles = [
    {
      role: UserRole.AUTHORITY,
      title: 'Land Authority (Admin)',
      badge: 'bg-orange-100 text-orange-800 border-orange-200',
      description: 'Government Cadastral Registry Administrator & Chief Registrar',
      canRegister: true,
      canVerify: true,
      canTransferAny: false,
      canTransferOwned: true,
      canResolveDispute: true,
      canViewPublic: true,
    },
    {
      role: UserRole.OWNER,
      title: 'Property Owner (Alice)',
      badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      description: 'Deed title holder with verified rights to initiate transfers & view certificates',
      canRegister: false,
      canVerify: false,
      canTransferAny: false,
      canTransferOwned: true,
      canResolveDispute: false,
      canViewPublic: true,
    },
    {
      role: UserRole.BUYER,
      title: 'Buyer / New Owner (Bob)',
      badge: 'bg-blue-100 text-blue-800 border-blue-200',
      description: 'Prospective property purchaser receiving titles & depositing escrow funds',
      canRegister: false,
      canVerify: false,
      canTransferAny: false,
      canTransferOwned: false,
      canResolveDispute: false,
      canViewPublic: true,
    },
    {
      role: UserRole.VERIFIER,
      title: 'Surveyor / Notary (David)',
      badge: 'bg-purple-100 text-purple-800 border-purple-200',
      description: 'Official independent verifier validating land boundaries & deed IPFS hashes',
      canRegister: false,
      canVerify: true,
      canTransferAny: false,
      canTransferOwned: false,
      canResolveDispute: false,
      canViewPublic: true,
    },
    {
      role: UserRole.UNAUTHORIZED,
      title: 'Unauthorized User (Eve)',
      badge: 'bg-rose-100 text-rose-800 border-rose-200',
      description: 'External non-permissioned wallet. Any privileged calls will strictly REVERT',
      canRegister: false,
      canVerify: false,
      canTransferAny: false,
      canTransferOwned: false,
      canResolveDispute: false,
      canViewPublic: true,
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm overflow-hidden p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-orange-100 text-orange-600">
              <Shield className="h-5 w-5" />
            </span>
            <h3 className="text-lg font-bold text-stone-900 tracking-tight">Smart Contract Role & Access Control Matrix</h3>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Access permissions enforced on-chain via Solidity modifiers (<code>onlyAdmin</code>, <code>onlyAuthorizedRegistrar</code>, <code>onlyCurrentOwner</code>)
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-xs font-semibold text-orange-900">
          <Info className="h-3.5 w-3.5 text-orange-600" />
          Active Context: <span className="capitalize">{(currentRole || UserRole.AUTHORITY).toLowerCase()}</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-stone-200 bg-stone-50 text-stone-700 font-semibold">
              <th className="py-3 px-4">Role & Identity</th>
              <th className="py-3 px-3 text-center">Register Property</th>
              <th className="py-3 px-3 text-center">Verify Property</th>
              <th className="py-3 px-3 text-center">Transfer Owned</th>
              <th className="py-3 px-3 text-center">Flag Dispute</th>
              <th className="py-3 px-3 text-center">Public Search</th>
              <th className="py-3 px-3 text-right">Switch Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 text-stone-600">
            {roles.map((r) => {
              const isCurrent = r.role === currentRole;
              return (
                <tr
                  key={r.role}
                  className={`transition ${isCurrent ? 'bg-orange-50/70 font-medium text-stone-900' : 'hover:bg-stone-50/50'}`}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className={`inline-block px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${r.badge}`}>
                        {r.title}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] uppercase tracking-wider font-bold bg-orange-600 text-white px-1.5 py-0.5 rounded">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-stone-500 mt-1 max-w-xs">{r.description}</p>
                  </td>
                  <td className="py-3 px-3 text-center">
                    {r.canRegister ? (
                      <Check className="h-4 w-4 text-emerald-600 mx-auto" />
                    ) : (
                      <X className="h-4 w-4 text-stone-300 mx-auto" />
                    )}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {r.canVerify ? (
                      <Check className="h-4 w-4 text-emerald-600 mx-auto" />
                    ) : (
                      <X className="h-4 w-4 text-stone-300 mx-auto" />
                    )}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {r.canTransferOwned ? (
                      <Check className="h-4 w-4 text-emerald-600 mx-auto" />
                    ) : (
                      <X className="h-4 w-4 text-stone-300 mx-auto" />
                    )}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {r.canResolveDispute ? (
                      <Check className="h-4 w-4 text-emerald-600 mx-auto" />
                    ) : (
                      <X className="h-4 w-4 text-stone-300 mx-auto" />
                    )}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <Check className="h-4 w-4 text-emerald-600 mx-auto" />
                  </td>
                  <td className="py-3 px-3 text-right">
                    {onSelectRole && (
                      <button
                        onClick={() => onSelectRole(r.role)}
                        disabled={isCurrent}
                        className={`text-xs px-3 py-1 rounded-lg transition font-medium ${
                          isCurrent
                            ? 'bg-orange-600 text-white cursor-default'
                            : 'bg-white border border-stone-300 text-stone-700 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-900'
                        }`}
                      >
                        {isCurrent ? 'Current' : 'Simulate'}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
