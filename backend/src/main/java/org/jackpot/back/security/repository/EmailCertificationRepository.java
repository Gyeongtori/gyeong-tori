package org.jackpot.back.security.repository;

import org.jackpot.back.security.model.entity.CertificationNumber;
import org.springframework.data.repository.CrudRepository;

public interface EmailCertificationRepository extends CrudRepository<CertificationNumber, String> {

}